def text_to_spi_frames(text):
    frames = []
    
    for char in text:
        ascii_val = ord(char)
        # SPI genellikle MSB First (En anlamlı bit önce) gönderir
        bits = format(ascii_val, '08b')
        data_bits = [int(b) for b in bits]
        
        # SPI İletişim Adımları (12 adımda görselleştireceğiz):
        # Adım 0: Boşta (Idle)
        # Adım 1: CS Low (İletişim Başlar)
        # Adım 2-9: 8 adet Veri Biti
        # Adım 10: CS High (İletişim Biter)
        # Adım 11: Boşta (Idle)
        
        cs   = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
        sck  = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0] # 1 olan yerlerde React saat darbesi çizecek
        mosi = [0, 0] + data_bits + [0, 0]
        miso = [0, 0] + [0]*8 + [0, 0] # Şimdilik gelen veriyi (MISO) 0 kabul ediyoruz
        
        labels = ["IDLE", "CS LOW"] + [f"D{7-i}" for i in range(8)] + ["CS HIGH", "IDLE"]
        
        frame = {
            "char": char,
            "ascii": ascii_val,
            "bits": bits,
            "cs": cs,
            "sck": sck,
            "mosi": mosi,
            "miso": miso,
            "labels": labels,
            "error": None
        }
        frames.append(frame)
        
    return frames