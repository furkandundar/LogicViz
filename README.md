# ⚡ LogicViz Analyzer

**LogicViz Analyzer**, gömülü sistemlerde yaygın olarak kullanılan donanım haberleşme protokollerini (UART, I2C, SPI) teorik olarak hesaplayan ve bir web tarayıcısı üzerinden dijital mantık analizörü (Logic Analyzer) veya osiloskop ekranı gibi görselleştiren **Full-Stack** bir web uygulamasıdır.

🔗 **[Canlı Demoyu İncele (Live Demo)](https://logic-viz.vercel.app/)**

*(Not: Backend sunucusu ücretsiz Render planında çalıştığı için 15 dakika inaktif kaldığında uyku moduna geçer. İlk simülasyon isteği 30-40 saniye sürebilir, uyanma gerçekleştikten sonraki istekler milisaniyeler içinde yanıtlanır.)*

---

## 📸 Ekran Görüntüleri

<img width="1871" height="1814" alt="screencapture-logic-dwhxkeybo-furkandundars-projects-vercel-app-2026-03-27-01_50_41" src="https://github.com/user-attachments/assets/2a6e40aa-bee6-4f9b-800f-103da3676f24" />

---

## 🚀 Özellikler
* **UART Simülasyonu:** Baud rate, Parity (Tek/Çift/Yok) ve Stop Biti ayarları. Data bitlerine tıklayarak manuel "Parity Hatası" (Gürültü) oluşturma ve görsel hata tespiti.
* **I2C Simülasyonu:** SCL (Saat) ve SDA (Veri) hatlarının senkronize çizimi.
* **SPI Simülasyonu:** CS, SCK, MOSI ve MISO olmak üzere 4 farklı veri yolunun (SPI Mode 0) eşzamanlı sinyal dalgası çizimi.
* **İnteraktif SVG Grafikleri:** Veriler backend'de hesaplandıktan sonra frontend tarafında dinamik ve ölçeklenebilir vektör grafikleri (SVG) ile pürüzsüzce çizilir.

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

**Frontend (İstemci):**
* React.js & Vite (Hızlı geliştirme ortamı)
* JavaScript (ES6+) & JSX
* Dinamik SVG Çizimleri
* Vercel (Deployment)

**Backend (Sunucu):**
* Python 3
* Flask & Flask-CORS (RESTful API mimarisi)
* Render (Deployment)

---

## 💻 Kurulum (Lokalde Çalıştırmak İçin)

Projeyi kendi bilgisayarınızda çalıştırmak isterseniz:

**1. Depoyu Klonlayın:**
```bash
git clone https://github.com/furkandundar/LogicViz.git
cd LogicViz
