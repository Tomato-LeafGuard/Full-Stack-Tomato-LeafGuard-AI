import logging
from pathlib import Path
from rembg import remove
from PIL import Image

logger = logging.getLogger(__name__)

def remove_leaf_background(image_path: str, output_path: str) -> str:
    """
    Menghapus background menggunakan AI (rembg) agar potongan daun mulus, 
    persis seperti di script MVP Data Scientist.
    """
    source = Path(image_path)
    destination = Path(output_path)
    
    try:
        destination.parent.mkdir(parents=True, exist_ok=True)
        
        # 1. Buka gambar original
        img = Image.open(source)
        
        # 2. Hapus background pakai rembg (menghasilkan RGBA transparan)
        output_image = remove(img)
        
        # 3. Konversi ke RGB (otomatis area transparan menjadi warna hitam pekat)
        final_img = output_image.convert("RGB")
        
        # 4. Simpan ke JPG
        final_img.save(destination, format="JPEG", quality=95, optimize=True)
        
        return str(destination)
        
    except Exception as exc:
        logger.error("Background removal failed for %s: %s", source, exc)
        # Jika gagal, kembalikan gambar aslinya agar web tidak error
        return str(source)