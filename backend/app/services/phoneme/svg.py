# Clean cross-section mouth diagrams — side view, cartoon style
# Colors: lips=#E8756A, teeth=white, tongue=#E8756A dark, palate=#F5C5A3, airflow=#6AABFF

MOUTH_SVGS = {
    "lips_closed_puff": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Upper lip -->
  <path d="M 50 75 Q 120 60 190 75" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Lower lip -->
  <path d="M 50 85 Q 120 100 190 85" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Pressed together line -->
  <path d="M 50 80 Q 120 80 190 80" stroke="#C0392B" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4,3"/>
  <!-- Puff arrows -->
  <path d="M 200 72 L 220 72 M 215 67 L 220 72 L 215 77" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 200 80 L 225 80 M 220 75 L 225 80 L 220 85" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 200 88 L 220 88 M 215 83 L 220 88 L 215 93" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="130" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Press lips together firmly</text>
</svg>""",

    "lips_closed_hum": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <path d="M 50 75 Q 120 62 190 75" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 50 85 Q 120 98 190 85" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 50 80 Q 120 80 190 80" stroke="#C0392B" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Hum waves from nose -->
  <path d="M 100 45 Q 110 38 120 45 Q 130 52 140 45" stroke="#A8FF6F" stroke-width="2" fill="none"/>
  <path d="M 105 35 Q 120 25 135 35" stroke="#A8FF6F" stroke-width="2" fill="none" opacity="0.6"/>
  <text x="120" y="130" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Close lips and hum through nose</text>
</svg>""",

    "tongue_tip_up": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Side view of mouth -->
  <!-- Upper teeth -->
  <rect x="80" y="55" width="80" height="16" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Lower teeth -->
  <rect x="80" y="95" width="80" height="14" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Palate/roof -->
  <path d="M 80 55 Q 50 50 40 70" stroke="#F5C5A3" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Tongue tip touching behind top teeth -->
  <path d="M 40 110 Q 60 105 85 95 Q 90 75 88 68" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="88" cy="67" r="5" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <!-- Touch indicator -->
  <circle cx="88" cy="67" r="9" fill="none" stroke="#FFD166" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="120" y="148" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Tongue tip behind top teeth</text>
</svg>""",

    "tongue_back_up": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="80" y="55" width="80" height="16" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="80" y="95" width="80" height="14" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
  <path d="M 80 55 Q 50 50 40 70" stroke="#F5C5A3" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Back of tongue raised up -->
  <path d="M 40 115 Q 55 110 70 105 Q 85 100 100 95 Q 115 75 130 68" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="130" cy="68" r="5" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <circle cx="130" cy="68" r="9" fill="none" stroke="#FFD166" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="120" y="148" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Back of tongue touches roof</text>
</svg>""",

    "teeth_on_lip": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Upper teeth -->
  <rect x="70" y="58" width="90" height="16" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Bottom lip -->
  <path d="M 60 90 Q 120 105 190 90" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Teeth resting on lip indicator -->
  <path d="M 70 74 L 70 85 Q 90 90 110 88" stroke="#FFD166" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
  <!-- Airflow -->
  <path d="M 165 65 L 190 60 M 185 55 L 190 60 L 185 65" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 165 75 L 195 75 M 190 70 L 195 75 L 190 80" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Top teeth on bottom lip, blow air</text>
</svg>""",

    "teeth_together_hiss": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Upper teeth -->
  <rect x="70" y="62" width="90" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Lower teeth -->
  <rect x="70" y="84" width="90" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Gap between teeth -->
  <line x1="70" y1="80" x2="160" y2="80" stroke="#1E2B1A" stroke-width="2"/>
  <!-- Hiss airflow through gap -->
  <path d="M 160 72 L 185 68 M 180 63 L 185 68 L 180 73" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 160 80 L 190 80 M 185 75 L 190 80 L 185 85" stroke="#6AABFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 160 88 L 185 92 M 180 87 L 185 92 L 180 97" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Teeth together, air through gap</text>
</svg>""",

    "lips_rounded_push": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Rounded lips front view -->
  <ellipse cx="120" cy="80" rx="35" ry="28" fill="none" stroke="#E8756A" stroke-width="8"/>
  <ellipse cx="120" cy="80" rx="18" ry="13" fill="#0D1117"/>
  <!-- Push arrows -->
  <path d="M 60 70 L 82 70 M 77 65 L 82 70 L 77 75" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 55 80 L 82 80 M 77 75 L 82 80 L 77 85" stroke="#6AABFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 60 90 L 82 90 M 77 85 L 82 90 L 77 95" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Lips pushed forward indicator -->
  <path d="M 120 52 L 120 30 M 115 35 L 120 30 L 125 35" stroke="#FFD166" stroke-width="1.5" fill="none"/>
  <text x="165" y="55" font-size="10" fill="#FFD166" font-family="sans-serif">push</text>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Round and push lips forward</text>
</svg>""",

    "tongue_between_teeth": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="70" y="58" width="90" height="15" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="70" y="87" width="90" height="15" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Tongue poking between teeth -->
  <path d="M 40 100 Q 60 95 80 80 Q 90 75 100 78" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="105" cy="76" rx="14" ry="8" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <!-- Airflow over tongue -->
  <path d="M 118 70 L 185 62 M 180 57 L 185 62 L 180 67" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 118 76 L 190 76 M 185 71 L 190 76 L 185 81" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Tongue tip gently between teeth</text>
</svg>""",

    "tongue_curled_lips_rounded": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Rounded lips -->
  <ellipse cx="120" cy="80" rx="30" ry="24" fill="none" stroke="#E8756A" stroke-width="7"/>
  <ellipse cx="120" cy="80" rx="16" ry="11" fill="#0D1117"/>
  <!-- Tongue curled up inside -->
  <path d="M 40 110 Q 70 100 95 90 Q 110 85 115 82" stroke="#C0392B" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Curl indicator -->
  <path d="M 115 82 Q 118 75 113 72" stroke="#C0392B" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="112" cy="71" r="4" fill="#E8756A"/>
  <text x="120" y="145" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Lips round, tongue curled up</text>
</svg>""",

    "tongue_tip_up_sides_open": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="75" y="55" width="85" height="15" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="75" y="90" width="85" height="15" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Tongue tip up -->
  <path d="M 40 108 Q 65 102 80 92 Q 88 78 88 68" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="88" cy="67" r="5" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <!-- Air around sides -->
  <path d="M 75 80 L 50 72 M 55 67 L 50 72 L 55 77" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 160 80 L 185 72 M 180 67 L 185 72 L 180 77" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="140" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Tongue tip up, air flows sides</text>
</svg>""",

    "lips_rounded_open": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <ellipse cx="120" cy="80" rx="38" ry="32" fill="none" stroke="#E8756A" stroke-width="8"/>
  <ellipse cx="120" cy="82" rx="22" ry="18" fill="#1a0000" opacity="0.8"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Lips rounded and open</text>
</svg>""",

    "mouth_open_breathe": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <path d="M 60 68 Q 120 52 180 68" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 65 95 Q 120 112 175 95" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="120" cy="83" rx="52" ry="18" fill="#1a0000" opacity="0.6"/>
  <!-- Breath out arrows -->
  <path d="M 175 72 L 205 65 M 200 60 L 205 65 L 200 70" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 177 82 L 210 82 M 205 77 L 210 82 L 205 87" stroke="#6AABFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 175 92 L 205 99 M 200 94 L 205 99 L 200 104" stroke="#6AABFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Open mouth, breathe out gently</text>
</svg>""",

    "mouth_wide_open": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <path d="M 45 62 Q 120 42 195 62" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 50 102 Q 120 124 190 102" stroke="#E8756A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Upper teeth -->
  <rect x="65" y="68" width="110" height="12" rx="2" fill="white" stroke="#EEE" stroke-width="1"/>
  <!-- Lower teeth -->
  <rect x="65" y="90" width="110" height="12" rx="2" fill="white" stroke="#EEE" stroke-width="1"/>
  <!-- Tongue flat and forward -->
  <path d="M 40 108 Q 80 100 120 95 Q 140 92 150 90" stroke="#C0392B" stroke-width="5" fill="none" stroke-linecap="round"/>
  <text x="120" y="148" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Mouth wide open, tongue forward</text>
</svg>""",

    "mouth_half_open": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <path d="M 55 68 Q 120 52 185 68" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 58 96 Q 120 112 182 96" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="70" y="72" width="100" height="11" rx="2" fill="white" stroke="#EEE" stroke-width="1"/>
  <rect x="70" y="87" width="100" height="11" rx="2" fill="white" stroke="#EEE" stroke-width="1"/>
  <path d="M 40 105 Q 75 98 100 92 Q 120 88 140 87" stroke="#C0392B" stroke-width="5" fill="none" stroke-linecap="round"/>
  <text x="120" y="140" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Mouth half open, tongue middle</text>
</svg>""",

    "mouth_nearly_closed_smile": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <path d="M 50 75 Q 120 58 190 75" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 50 85 Q 120 92 190 85" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <!-- Small smile gap -->
  <path d="M 70 80 Q 120 84 170 80" stroke="#1a0000" stroke-width="3" fill="none"/>
  <!-- Tongue high -->
  <path d="M 40 100 Q 75 88 110 82 Q 130 78 150 78" stroke="#C0392B" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Smile, tongue high and forward</text>
</svg>""",

    "lips_small_circle": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <ellipse cx="120" cy="80" rx="20" ry="18" fill="none" stroke="#E8756A" stroke-width="9"/>
  <ellipse cx="120" cy="80" rx="8" ry="7" fill="#1a0000" opacity="0.8"/>
  <!-- Tight circle arrows -->
  <path d="M 95 80 L 72 80 M 77 75 L 72 80 L 77 85" stroke="#FFD166" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M 145 80 L 168 80 M 163 75 L 168 80 L 163 85" stroke="#FFD166" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Lips in a tight small circle</text>
</svg>""",

    "lips_rounded_wide": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <ellipse cx="120" cy="80" rx="42" ry="34" fill="none" stroke="#E8756A" stroke-width="8"/>
  <ellipse cx="120" cy="83" rx="28" ry="20" fill="#1a0000" opacity="0.7"/>
  <!-- Tongue back and low -->
  <path d="M 40 115 Q 70 108 95 100 Q 110 96 118 96" stroke="#C0392B" stroke-width="5" fill="none" stroke-linecap="round"/>
  <text x="120" y="140" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Lips rounded, mouth open wide</text>
</svg>""",

    "mouth_smile_closed": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <!-- Wide smile -->
  <path d="M 45 75 Q 120 58 195 75" stroke="#E8756A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 45 80 Q 120 88 195 80" stroke="#E8756A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Corners pulled back -->
  <path d="M 195 75 Q 205 78 195 80" stroke="#E8756A" stroke-width="4" fill="none"/>
  <path d="M 45 75 Q 35 78 45 80" stroke="#E8756A" stroke-width="4" fill="none"/>
  <!-- Tongue high -->
  <path d="M 50 100 Q 90 88 130 82 Q 155 78 175 78" stroke="#C0392B" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="120" y="138" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Wide smile, tongue high up</text>
</svg>""",

    "tongue_high_slide": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="75" y="58" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="75" y="88" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Tongue high then slides down — arrow path -->
  <path d="M 40 108 Q 65 100 85 88 Q 95 76 100 68" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Slide down arrow -->
  <path d="M 100 68 Q 115 75 125 88" stroke="#FFD166" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="4,3"/>
  <path d="M 120 85 L 125 88 L 122 82" stroke="#FFD166" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="120" y="140" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Tongue starts high, slides down</text>
</svg>""",

    "tongue_curled_back_touch": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="75" y="55" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="75" y="90" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <!-- Palate ridge further back -->
  <path d="M 75 55 Q 55 52 45 68" stroke="#F5C5A3" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Tongue curled back -->
  <path d="M 40 110 Q 60 105 80 98 Q 95 92 105 88 Q 118 78 122 70 Q 124 62 118 60" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="118" cy="59" r="5" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <circle cx="118" cy="59" r="9" fill="none" stroke="#FFD166" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="120" y="148" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Curl tongue back, touch roof</text>
</svg>""",

    "tongue_tip_up_hum": """
<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="#0D1117" rx="12"/>
  <rect x="75" y="55" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <rect x="75" y="90" width="85" height="14" rx="2" fill="white" stroke="#DDD" stroke-width="1"/>
  <path d="M 40 108 Q 65 102 82 92 Q 88 78 88 67" stroke="#C0392B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="88" cy="66" r="5" fill="#E8756A" stroke="#C0392B" stroke-width="2"/>
  <!-- Hum through nose waves -->
  <path d="M 90 30 Q 105 22 120 30 Q 135 38 150 30" stroke="#A8FF6F" stroke-width="2" fill="none"/>
  <path d="M 95 20 Q 115 10 135 20" stroke="#A8FF6F" stroke-width="2" fill="none" opacity="0.5"/>
  <text x="120" y="148" text-anchor="middle" font-size="11" fill="#4A5548" font-family="sans-serif">Tongue tip up, hum through nose</text>
</svg>""",
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
