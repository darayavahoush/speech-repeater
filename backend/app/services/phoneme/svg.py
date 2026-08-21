# Lips-only mouth diagrams — front view, no face, clear teeth/tongue like a phonetics chart

LIP = "#E8635A"
LIP_DARK = "#C23F38"
CAVITY = "#4A1E1B"
TOOTH = "#FFFFFF"
TOOTH_EDGE = "#C9C9C9"
TONGUE = "#E8756A"
TONGUE_EDGE = "#C04848"
AIR = "#6AABFF"
VOICE = "#7FCC5A"

CX = 95

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

def _closed_lips():
    return f'''<path d="M 32 64 Q 60 42 95 43 Q 130 42 158 64 Q 130 54 95 54 Q 60 54 32 64 Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <path d="M 32 64 Q 60 86 95 85 Q 130 86 158 64 Q 130 74 95 74 Q 60 74 32 64 Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <path d="M 36 64 Q 95 64 154 64" stroke="{LIP_DARK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>'''

def _teeth_gap(gap=8, cy=64):
    top = cy - gap / 2
    bot = cy + gap / 2
    return f'''<path d="M 32 {cy} Q 60 44 95 45 Q 130 44 158 {cy} Q 130 52 95 52 Q 60 52 32 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <path d="M 32 {cy} Q 60 84 95 83 Q 130 84 158 {cy} Q 130 76 95 76 Q 60 76 32 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <rect x="46" y="{top-8}" width="98" height="8" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>
  <rect x="46" y="{top}" width="98" height="{gap}" fill="{CAVITY}"/>
  <rect x="46" y="{bot}" width="98" height="8" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>'''

def _wide_open(gap=26, cy=66):
    top = cy - gap / 2
    bot = cy + gap / 2
    return f'''<path d="M 28 {cy} Q 58 38 95 39 Q 132 38 162 {cy} Q 132 50 95 50 Q 58 50 28 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <path d="M 28 {cy} Q 58 92 95 91 Q 132 92 162 {cy} Q 132 80 95 80 Q 58 80 28 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <rect x="46" y="{top-1}" width="98" height="{gap+2}" fill="{CAVITY}"/>
  <rect x="44" y="{top-2}" width="102" height="9" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>
  <rect x="44" y="{bot-7}" width="102" height="9" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>'''

def _smile(gap=6, cy=64):
    return f'''<path d="M 26 {cy} Q 60 50 95 50 Q 130 50 164 {cy} Q 130 55 95 55 Q 60 55 26 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <path d="M 26 {cy} Q 60 78 95 78 Q 130 78 164 {cy} Q 130 73 95 73 Q 60 73 26 {cy} Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <rect x="40" y="{cy-gap/2-2}" width="110" height="{gap+4}" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>
  <path d="M 26 {cy} Q 22 {cy} 26 {cy+4}" stroke="{LIP_DARK}" stroke-width="1.4" fill="none"/>
  <path d="M 164 {cy} Q 168 {cy} 164 {cy+4}" stroke="{LIP_DARK}" stroke-width="1.4" fill="none"/>'''

def _round(outer_rx=26, outer_ry=20, inner_rx=13, inner_ry=10, cy=64):
    return f'''<ellipse cx="{CX}" cy="{cy}" rx="{outer_rx}" ry="{outer_ry}" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <ellipse cx="{CX}" cy="{cy}" rx="{inner_rx}" ry="{inner_ry}" fill="{CAVITY}"/>'''

def _pucker(outer_rx=16, outer_ry=13, inner_rx=6, inner_ry=5, cy=64):
    return f'''<ellipse cx="{CX}" cy="{cy}" rx="{outer_rx}" ry="{outer_ry}" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <ellipse cx="{CX}" cy="{cy}" rx="{inner_rx}" ry="{inner_ry}" fill="{CAVITY}"/>'''

def _protrude(cy=64):
    return f'''<ellipse cx="{CX}" cy="{cy}" rx="24" ry="17" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <ellipse cx="{CX}" cy="{cy}" rx="12" ry="9" fill="{CAVITY}"/>
  <path d="M 86 {cy-6} Q 95 {cy-9} 104 {cy-6}" stroke="{TOOTH}" stroke-width="3" fill="none" stroke-linecap="round"/>'''

def _teeth_on_lip():
    return f'''<path d="M 44 46 Q 95 40 146 46" stroke="{LIP_DARK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 34 60 Q 62 84 95 85 Q 128 84 156 60 Q 128 76 95 77 Q 62 76 34 60 Z" fill="{LIP}" stroke="{LIP_DARK}" stroke-width="1.2"/>
  <rect x="52" y="50" width="86" height="16" rx="2" fill="{TOOTH}" stroke="{TOOTH_EDGE}" stroke-width="0.6"/>'''

def _tongue_between_teeth():
    return _teeth_gap(gap=10) + f'<ellipse cx="95" cy="64" rx="20" ry="6" fill="{TONGUE}" stroke="{TONGUE_EDGE}" stroke-width="1.2"/>'

def _tongue_up_open():
    return _wide_open(gap=22, cy=64) + f'<path d="M 70 78 Q 82 66 95 58 Q 102 54 108 56" stroke="{TONGUE}" stroke-width="6" fill="none" stroke-linecap="round"/>'

def _retroflex_hook():
    return f'<path d="M 80 42 Q 95 30 110 42 Q 116 48 106 52" stroke="{TONGUE_EDGE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>'

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

"lips_closed_puff": _wrap(_closed_lips() + _voicing(), "lips together, voice on", "/B/"),

"lips_closed_puff_voiceless": _wrap(_closed_lips() + _puff(), "lips together, puff of air", "/P/"),

"lips_closed_hum": _wrap(_closed_lips() + _hum(), "lips together, hum through nose", "/M/"),

"tongue_tip_up": _wrap(_teeth_gap() + _voicing(), "tongue tip up, voice on", "/D/"),

"tongue_tip_up_voiceless": _wrap(_teeth_gap() + _puff(), "tongue tip up, puff of air", "/T/"),

"tongue_tip_up_hum": _wrap(_teeth_gap() + _hum(), "tongue tip up, hum through nose", "/N/"),

"tongue_back_up": _wrap(_teeth_gap(gap=6) + _voicing(), "back of tongue up, voice on", "/G/"),

"tongue_back_up_voiceless": _wrap(_teeth_gap(gap=6) + _puff(), "back of tongue up, puff of air", "/K/"),

"teeth_on_lip": _wrap(_teeth_on_lip() + _airflow(), "top teeth on lower lip, blow", "/F/"),

"teeth_on_lip_voiced": _wrap(_teeth_on_lip() + _airflow() + _voicing(), "like F, but voice on", "/V/"),

"teeth_together_hiss": _wrap(_teeth_gap(gap=4) + _airflow(), "teeth close, hiss through gap", "/S/"),

"teeth_together_hiss_voiced": _wrap(_teeth_gap(gap=4) + _airflow() + _voicing(), "like S, but voice on", "/Z/"),

"lips_rounded_push": _wrap(_protrude() + _airflow(x=134), "lips round and push forward", "/SH/"),

"lips_rounded_push_voiced": _wrap(_protrude() + _airflow(x=134) + _voicing(), "like SH, but voice on", "/JH/"),

"tongue_between_teeth": _wrap(_tongue_between_teeth() + _airflow(), "tongue tip peeks between teeth", "/TH/"),

"tongue_tip_up_sides_open": _wrap(_tongue_up_open(), "tongue tip up, air flows past sides", "/L/"),

"tongue_curled_lips_rounded": _wrap(_teeth_gap(gap=10) + _retroflex_hook(), "lips round, tongue curls back", "/R/"),

"lips_rounded_open": _wrap(_pucker(outer_rx=20, outer_ry=16, inner_rx=9, inner_ry=7), "tight round pucker", "/W/"),

"tongue_high_slide": _wrap(_smile(gap=8), "tongue high, slides into next sound", "/Y/"),

"mouth_open_breathe": _wrap(_wide_open(gap=18) + _airflow(x=160), "mouth relaxed open, breathe out", "/H/"),

"mouth_wide_open": _wrap(_wide_open(gap=30), "mouth wide open", "/AE/"),

"lips_rounded_wide": _wrap(_round(), "lips round and open", "/AO/"),

"mouth_half_open": _wrap(_wide_open(gap=18), "mouth half open", "/EH/"),

"mouth_nearly_closed_smile": _wrap(_smile(gap=5), "mouth nearly closed, slight smile", "/IH/"),

"mouth_smile_closed": _wrap(_smile(gap=4), "wide smile, teeth close together", "/IY/"),

"lips_small_circle": _wrap(_pucker(), "tight small circle", "/UW/"),

"tongue_curled_back_touch": _wrap(_teeth_gap(gap=8) + _retroflex_hook(), "curl tongue tip back", "/RT/"),

"tongue_curled_back_touch_voiced": _wrap(_teeth_gap(gap=8) + _retroflex_hook() + _voicing(), "curl tongue back, voice on", "/RD/"),

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
