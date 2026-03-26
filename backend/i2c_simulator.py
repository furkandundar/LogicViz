def text_to_i2c_frames(text, device_address=0x50):
    frames = []
    
    # 7-bit cihaz adresini binary listesine çevir (Örn: 0x50 -> 1010000)
    addr_bits = [int(b) for b in format(device_address, '07b')]
    rw_bit = [0] # 0 = Write (Yazma işlemi simüle ediyoruz)
    
    for char in text:
        ascii_val = ord(char)
        bits = format(ascii_val, '08b')
        data_bits = [int(b) for b in bits]
        
        # I2C Frame Yapısı (Basitleştirilmiş):
        # 1. START Condition (SDA Low)
        # 2. Address (7 bit) + R/W (1 bit)
        # 3. ACK (Slave SDA'yı Low yapar)
        # 4. Data (8 bit)
        # 5. ACK (Slave SDA'yı Low yapar)
        # 6. STOP Condition (SDA High)
        
        sda = [0] + addr_bits + rw_bit + [0] + data_bits + [0] + [1]
        
        labels = ["START"] + \
                 [f"A{6-i}" for i in range(7)] + ["W"] + \
                 ["ACK"] + \
                 [f"D{7-i}" for i in range(8)] + \
                 ["ACK", "STOP"]
                 
        frame = {
            "char": char,
            "ascii": ascii_val,
            "bits": bits,
            "address": hex(device_address),
            "sda": sda,
            "labels": labels,
            "error": None
        }
        frames.append(frame)
        
    return frames

def simulate_i2c_error(frames, error_type=None):
    import random
    
    if error_type == "nack":
        # NACK Hatası: Alıcı cihaz adresi veya veriyi onaylamaz (SDA High kalır)
        for frame in frames:
            frame["sda"][9] = 1 # Adres sonrası ACK bitini 1 (NACK) yap
            frame["labels"][9] = "NACK"
            frame["error"] = f"Cihaz {frame['address']} yanıt vermedi (NACK)"
            # Veri kısmı anlamsızlaşır ama çizim için bırakıyoruz
            
    elif error_type == "noise":
        # Veri bitlerinden birini rastgele boz
        for frame in frames:
            idx = random.randint(11, 18) # Data bitlerinin index aralığı
            frame["sda"][idx] ^= 1 # Biti tersine çevir
            frame["error"] = f"Gürültü: {frame['labels'][idx]} biti bozuldu"
            
    return frames