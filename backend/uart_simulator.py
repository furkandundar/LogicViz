import random

def text_to_uart_frames(text, baud_rate=9600, parity="none", stop_bits=1):
    frames = []
    
    for char in text:
        ascii_val = ord(char)
        bits = format(ascii_val, '08b')
        
        # 1. Aşama: Data bitlerini listeye çevir (LSB First - En sağdaki bit önce gider)
        data_bits = [int(b) for b in reversed(bits)]
        labels = [f"D{i}" for i in range(8)]
        
        # 2. Aşama: Parity (Eşlik) Bitini Hesapla
        frame_bits = [0] + data_bits # START biti (0) + Data bitleri eklendi
        frame_labels = ["START"] + labels
        
        if parity != "none":
            ones_count = sum(data_bits) # Verideki '1' sayısını bul
            
            if parity == "even":
                # Çift Parity: '1'lerin sayısı çift olmalı. Tekse Parity=1, Çiftse Parity=0
                parity_bit = 1 if ones_count % 2 != 0 else 0
            elif parity == "odd":
                # Tek Parity: '1'lerin sayısı tek olmalı. Çiftse Parity=1, Tekse Parity=0
                parity_bit = 1 if ones_count % 2 == 0 else 0
                
            frame_bits.append(parity_bit)
            frame_labels.append("PAR")
            
        # 3. Aşama: Stop Bitlerini Ekle (Stop bitleri her zaman 1'dir)
        for i in range(stop_bits):
            frame_bits.append(1)
            frame_labels.append(f"STOP{i+1}" if stop_bits > 1 else "STOP")
            
        frame = {
            "char": char,
            "ascii": ascii_val,
            "bits": bits,
            "baud_rate": baud_rate,
            "parity": parity,
            "stop_bits": stop_bits,
            "frame": frame_bits,
            "labels": frame_labels,
            "error": None
        }
        frames.append(frame)
    
    return frames

def simulate_uart_error(frames, error_type=None):
    if error_type == "noise":
        for frame in frames:
            # Data bitlerinden birini (index 1 ile 8 arası) rastgele ters çevir
            idx = random.randint(1, 8)
            frame["frame"][idx] ^= 1
            frame["error"] = f"Gürültü: D{idx-1} biti bozuldu"
            
            # Parity açıksa, gürültü parity hatasına neden olur (Görselde anlaşılması için)
            if frame["parity"] != "none":
                 frame["error"] += " -> PARITY HATASI!"
                 
    elif error_type == "wrong_baud":
        for frame in frames:
            frame["error"] = "Baud rate uyumsuzluğu (Senkronizasyon kaybı)"
            # Görüntüyü bozmak için rastgele bitler üret
            frame["frame"] = [random.randint(0,1) for _ in range(len(frame["frame"]))]
    
    return frames

# İŞTE EKSİK OLAN VE APP.PY'NİN ARADIĞI KÖPRÜ FONKSİYON:
def simulate_uart(text, baud_rate=9600, parity="none", stop_bits=1, error_type=None):
    # Önce normal çerçeveleri oluştur
    frames = text_to_uart_frames(text, baud_rate, parity, stop_bits)
    # Eğer bir hata tipi seçildiyse, hata simülasyonunu uygula
    if error_type:
        frames = simulate_uart_error(frames, error_type)
    return frames