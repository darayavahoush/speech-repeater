# Lips-only mouth diagrams — raster icon per mouth shape, vector overlay cues for voicing/airflow

import base64
from pathlib import Path

ICON_DIR = Path(__file__).parent / "assets" / "mouth_icons"

AIR = "#6AABFF"
VOICE = "#7FCC5A"

_ICON_CACHE: dict[str, str] = {}


def _icon_b64(filename: str) -> str:
    if filename not in _ICON_CACHE:
        path = ICON_DIR / filename
        _ICON_CACHE[filename] = base64.b64encode(path.read_bytes()).decode("ascii")
    return _ICON_CACHE[filename]


def _icon(filename: str, x=40, y=4, w=110, h=108) -> str:
    b64 = _icon_b64(filename)
    return (
        f'<image href="data:image/png;base64,{b64}" x="{x}" y="{y}" '
        f'width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"/>'
    )


def _airflow(x=158, y=64):
    return f'''<path d="M {x} {y-8} L {x+18} {y-12}" stroke="{AIR}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M {x} {y} L {x+20} {y}" stroke="{AIR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M {x} {y+8} L {x+18} {y+12}" stroke="{AIR}" stroke-width="1.5" fill="none" stroke-linecap="round"/>'''


def _puff(x=95, y=95):
    return f'''<path d="M {x-16} {y} L {x-20} {y+10}" stroke="{AIR}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M {x} {y+2} L {x} {y+13}" stroke="{AIR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M {x+16} {y} L {x+20} {y+10}" stroke="{AIR}" stroke-width="1.5" fill="none" stroke-linecap="round"/>'''


def _voicing():
    return f'<path d="M 18 60 Q 24 55 30 60 Q 36 65 42 60" stroke="{VOICE}" stroke-width="1.8" fill="none" stroke-linecap="round"/>'


def _hum():
    return f'''<path d="M 78 38 Q 84 33 90 38 Q 96 43 102 38 Q 108 33 114 38" stroke="{VOICE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>'''


def _wrap(content, label, badge):
    return f'''<svg viewBox="0 0 190 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="190" height="120" rx="10" fill="#0D1117" stroke="#1E2B1A" stroke-width="1"/>
  <rect x="10" y="6" width="52" height="24" rx="6" fill="#1A2E14"/>
  <text x="36" y="23" text-anchor="middle" font-size="13" font-weight="700" fill="#A8FF6F" font-family="monospace">{badge}</text>
  <g transform="translate(0,4)">
    {content}
  </g>
  <text x="95" y="116" text-anchor="middle" font-size="8.5" fill="#4A5548" font-family="sans-serif">{label}</text>
</svg>'''


MOUTH_SVGS = {

"lips_closed_puff": _wrap(_icon("M_B_P.png") + _voicing(), "lips together, voice on", "/B/"),

"lips_closed_puff_voiceless": _wrap(_icon("M_B_P.png") + _puff(), "lips together, puff of air", "/P/"),

"lips_closed_hum": _wrap(_icon("M_B_P.png") + _hum(), "lips together, hum through nose", "/M/"),

"tongue_tip_up": _wrap(_icon("T_D_N.png") + _voicing(), "tongue tip up, voice on", "/D/"),

"tongue_tip_up_voiceless": _wrap(_icon("T_D_N.png") + _puff(), "tongue tip up, puff of air", "/T/"),

"tongue_tip_up_hum": _wrap(_icon("T_D_N.png") + _hum(), "tongue tip up, hum through nose", "/N/"),

"tongue_back_up": _wrap(_icon("K_G.png") + _voicing(), "back of tongue up, voice on", "/G/"),

"tongue_back_up_voiceless": _wrap(_icon("K_G.png") + _puff(), "back of tongue up, puff of air", "/K/"),

"teeth_on_lip": _wrap(_icon("F_V.png") + _airflow(), "top teeth on lower lip, blow", "/F/"),

"teeth_on_lip_voiced": _wrap(_icon("F_V.png") + _airflow() + _voicing(), "like F, but voice on", "/V/"),

"teeth_together_hiss": _wrap(_icon("S_Z.png") + _airflow(), "teeth close, hiss through gap", "/S/"),

"teeth_together_hiss_voiced": _wrap(_icon("S_Z.png") + _airflow() + _voicing(), "like S, but voice on", "/Z/"),

"lips_rounded_push": _wrap(_icon("SH_CH_J.png") + _airflow(x=134), "lips round and push forward", "/SH/"),

"lips_rounded_push_voiced": _wrap(_icon("SH_CH_J.png") + _airflow(x=134) + _voicing(), "like SH, but voice on", "/JH/"),

"tongue_between_teeth": _wrap(_icon("TH.png") + _airflow(), "tongue tip peeks between teeth", "/TH/"),

"tongue_tip_up_sides_open": _wrap(_icon("L.png"), "tongue tip up, air flows past sides", "/L/"),

"tongue_curled_lips_rounded": _wrap(_icon("R.png"), "lips round, tongue curls back", "/R/"),

"lips_rounded_open": _wrap(_icon("W.png"), "tight round pucker", "/W/"),

"tongue_high_slide": _wrap(_icon("Y.png"), "tongue high, slides into next sound", "/Y/"),

"mouth_open_breathe": _wrap(_icon("H.png") + _airflow(x=160), "mouth relaxed open, breathe out", "/H/"),

"mouth_wide_open": _wrap(_icon("AE.png"), "mouth wide open", "/AE/"),

"lips_rounded_wide": _wrap(_icon("OH.png"), "lips round and open", "/AO/"),

"mouth_half_open": _wrap(_icon("EH.png"), "mouth half open", "/EH/"),

"mouth_nearly_closed_smile": _wrap(_icon("IH.png"), "mouth nearly closed, slight smile", "/IH/"),

"mouth_smile_closed": _wrap(_icon("EE.png"), "wide smile, teeth close together", "/IY/"),

"lips_small_circle": _wrap(_icon("OO.png"), "tight small circle", "/UW/"),

"tongue_curled_back_touch": _wrap(_icon("R.png"), "curl tongue tip back", "/RT/"),

"tongue_curled_back_touch_voiced": _wrap(_icon("R.png") + _voicing(), "curl tongue back, voice on", "/RD/"),

}


def get_phoneme_svg(mouth_shape: str) -> str:
    return MOUTH_SVGS.get(mouth_shape, MOUTH_SVGS["mouth_half_open"])


def get_phoneme_card(phoneme: str) -> dict:
    from app.services.phoneme.data import PHONEME_DATA
    data = PHONEME_DATA.get(phoneme.upper(), {})
    if not data:
        return None
    return {
        "phoneme": phoneme,
        "ipa": data["ipa"],
        "name": data["name"],
        "example_word": data["example_word"],
        "tip": data["tip"],
        "mouth_svg": get_phoneme_svg(data["mouth_shape"]),
        "common_errors": data["common_errors"],
        "category": data["category"],
    }
