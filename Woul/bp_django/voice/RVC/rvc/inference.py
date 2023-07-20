import torch, os, traceback, sys, warnings, shutil, numpy as np
from infer_pack.models import SynthesizerTrnMs768NSFsid
import soundfile as sf
from fairseq import checkpoint_utils
from vc_infer_pipeline import VC
from config import Config
from my_utils import load_audio

model_name = 'ljs'
weight_root = "weights"
cpt, tgt_sr, if_f0, version, net_g, vc, n_spk = None, None, None, None, None, None, None

config = Config()
hubert_model = None
now_dir = os.getcwd()
sys.path.append(now_dir)
tmp = os.path.join(now_dir, "TEMP")
shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree("%s/runtime/Lib/site-packages/infer_pack" % (now_dir), ignore_errors=True)
shutil.rmtree("%s/runtime/Lib/site-packages/uvr5_pack" % (now_dir), ignore_errors=True)
os.makedirs(tmp, exist_ok=True)
os.makedirs(os.path.join(now_dir, "logs"), exist_ok=True)
os.makedirs(os.path.join(now_dir, "weights"), exist_ok=True)
os.environ["TEMP"] = tmp
warnings.filterwarnings("ignore")
torch.manual_seed(114514)

def load_hubert():
    global hubert_model
    models, _, _ = checkpoint_utils.load_model_ensemble_and_task(
        ["hubert_base.pt"],
        suffix="",
    )
    hubert_model = models[0]
    hubert_model = hubert_model.to(config.device)
    if config.is_half:
        hubert_model = hubert_model.half()
    else:
        hubert_model = hubert_model.float()
    hubert_model.eval()



def load_rvc_model(model_name):
    global cpt, tgt_sr, if_f0, version, net_g, vc, n_spk
    cpt = torch.load(f'weights/{model_name}.pth', map_location="cpu")
    tgt_sr = cpt["config"][-1]
    cpt["config"][-3] = cpt["weight"]["emb_g.weight"].shape[0] 
    if_f0 = cpt.get("f0", 1)
    version = cpt.get("version", "v1")
    net_g = SynthesizerTrnMs768NSFsid(*cpt["config"], is_half=config.is_half)

    del net_g.enc_q
    print(net_g.load_state_dict(cpt["weight"], strict=False))
    net_g.eval().to(config.device)
    if config.is_half:
        net_g = net_g.half()
    else:
        net_g = net_g.float()
    vc = VC(tgt_sr, config)
    n_spk = cpt["config"][-3]

def vc_single(
    sid,
    input_audio_path,
    f0_up_key,
    f0_file,
    f0_method,
    file_index,
    file_index2,
    index_rate,
    filter_radius,
    resample_sr,
    rms_mix_rate,
    protect,
):
    global tgt_sr, net_g, vc, hubert_model, version
    if input_audio_path is None:
        return "You need to upload an audio", None
    f0_up_key = int(f0_up_key)
    try:
        audio = load_audio(input_audio_path, 16000)
        audio_max = np.abs(audio).max() / 0.95
        if audio_max > 1:
            audio /= audio_max
        times = [0, 0, 0]
        if hubert_model == None:
            load_hubert()
        if_f0 = cpt.get("f0", 1)
        file_index = (
            (
                file_index.strip(" ")
                .strip('"')
                .strip("\n")
                .strip('"')
                .strip(" ")
                .replace("trained", "added")
            )
            if file_index != ""
            else file_index2
        )
        audio_opt = vc.pipeline(
            hubert_model,
            net_g,
            sid,
            audio,
            input_audio_path,
            times,
            f0_up_key,
            f0_method,
            file_index,
            index_rate,
            if_f0,
            filter_radius,
            tgt_sr,
            resample_sr,
            rms_mix_rate,
            version,
            protect,
            f0_file=f0_file,
        )
        if resample_sr >= 16000 and tgt_sr != resample_sr:
            tgt_sr = resample_sr
        index_info = (
            "Using index:%s." % file_index
            if os.path.exists(file_index)
            else "Index not used."
        )
        return "Success.\n %s\nTime:\n npy:%ss, f0:%ss, infer:%ss" % (
            index_info,
            times[0],
            times[1],
            times[2],
        ), (tgt_sr, audio_opt)
    except:
        info = traceback.format_exc()
        print(info)
        return info, (None, None)


def vc_multi(
    sid,
    dir_path,
    opt_root,
    paths,
    f0_up_key,
    f0_method,
    file_index,
    file_index2,
    index_rate,
    filter_radius,
    resample_sr,
    rms_mix_rate,
    protect,
    format1
):
    dir_path = (
        dir_path.strip(" ").strip('"').strip("\n").strip('"').strip(" ")
    )
    opt_root = opt_root.strip(" ").strip('"').strip("\n").strip('"').strip(" ")
    os.makedirs(opt_root, exist_ok=True)
    try:
        if dir_path != "":
            paths = [os.path.join(dir_path, name) for name in os.listdir(dir_path)]
        else:
            paths = [path.name for path in paths]
    except:
        traceback.print_exc()
        paths = [path.name for path in paths]

    for path in paths:
        _, opt = vc_single(
            sid,
            path,
            f0_up_key,
            None,
            f0_method,
            file_index,
            file_index2,
            index_rate,
            filter_radius,
            resample_sr,
            rms_mix_rate,
            protect,
        )
        tgt_sr, audio_opt = opt
        
        sf.write(
            "%s/%s" % (opt_root, os.path.basename(path)),
            audio_opt,
            tgt_sr,
        )


def make_dataset(vc_model_name, target, path_to_dataset):
    load_hubert()
    load_rvc_model(vc_model_name)
    # return
    if not os.path.isdir(f'{path_to_dataset}'):
        print(f'{path_to_dataset} is not directory')
        return
    
    for dataset_name in os.listdir(f'{path_to_dataset}'):
        dataset_dir = f'{path_to_dataset}/{dataset_name}/voice'
        os.makedirs(f'{dataset_dir}/{vc_model_name}', exist_ok=True)
        vc_multi(0, f"{dataset_dir}/{target}", f'{dataset_dir}/{vc_model_name}', None, 0.0, 'crepe', '', '', 1, 7, 0, 1, 0.33, 'wav')    


vc_model_name = sys.argv[1]
make_dataset_language = sys.argv[2]
path_to_dataset = sys.argv[3]
make_dataset(vc_model_name, make_dataset_language, path_to_dataset)