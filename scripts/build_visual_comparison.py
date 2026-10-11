from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SCREENSHOTS = ROOT / "artifacts" / "screenshots"
REFERENCE = ROOT / "src" / "images" / "kmutnb-lower-third-reference.jpg"
OUTPUT = SCREENSHOTS / "reference-comparison.jpg"

TEMPLATES = [
    ("01 Classic", "01-classic", (70, 63, 1275, 172), (32, 370, 700, 472)),
    ("02 Angular", "02-angular", (70, 220, 1225, 330), (32, 370, 680, 472)),
    ("03 Overlay", "03-overlay", (70, 384, 1200, 503), (32, 370, 650, 472)),
    ("04 Rounded", "04-rounded", (78, 550, 1278, 666), (32, 370, 705, 472)),
]


def contain(image: Image.Image, size: tuple[int, int], background: str) -> Image.Image:
    image = image.copy()
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, background)
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


reference = Image.open(REFERENCE).convert("RGB")
sheet = Image.new("RGB", (1640, 790), "#202326")
draw = ImageDraw.Draw(sheet)
draw.text((85, 24), "ORIGINAL REFERENCE", fill="#FFFFFF")
draw.text((885, 24), "UPDATED RENDER", fill="#FFFFFF")

for index, (label, slug, reference_box, updated_box) in enumerate(TEMPLATES):
    y = 62 + index * 180
    draw.text((18, y + 70), label, fill="#F15A24")

    reference_crop = reference.crop(reference_box)
    checker = Image.open(SCREENSHOTS / f"checker-{slug}.jpg").convert("RGB")
    updated_crop = checker.crop(updated_box)

    sheet.paste(contain(reference_crop, (740, 150), "#15191D"), (85, y))
    sheet.paste(contain(updated_crop, (740, 150), "#E5E6E5"), (885, y))

sheet.save(OUTPUT, quality=94, subsampling=0)
print(OUTPUT)
