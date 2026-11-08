import sys, cv2, numpy as np
# Efface la petite étoile (filigrane de l’outil de retouche) en bas à droite d’une photo.
# Usage : python3 scripts/effacer-etoile.py photo-source.jpg photo-propre.jpg
src, dst = sys.argv[1], sys.argv[2]
img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
h, w = img.shape[:2]
cx, cy, r = w-57, h-57, 36          # position fixe du filigrane (étoile) en bas à droite
s = 2*r
x, y = cx-r, cy-r
dx = s + 6                           # patch pris juste à gauche, même rangée
patch = img[y:y+s, x-dx:x-dx+s]
yy, xx = np.mgrid[0:s, 0:s]
dist = np.sqrt((xx-r+.5)**2 + (yy-r+.5)**2)
a = np.clip((r - dist)/10.0, 0, 1)[..., None]   # bord adouci
out = img.copy()
out[y:y+s, x:x+s] = a*patch + (1-a)*img[y:y+s, x:x+s]
out = np.clip(out,0,255).astype(np.uint8)
cv2.imwrite(dst, out, [cv2.IMWRITE_JPEG_QUALITY, 88])
