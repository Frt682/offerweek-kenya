# OfferWeek Kenya

Görsel olarak “Aktüel Ürünler: Market Katalog” uygulamasının iskeleti:
iki sekme, arama, sarı yıldız, iki sütun broşür kapağı, koyu mavi zemin.

İçerik Kenya zincirleridir. BİM / A101 / ŞOK markaları ve resmî logoları kopyalanmadı.

## Çalıştırma

Klasörü bir statik sunucu ile açın:

```bash
cd kenya-weekly
python3 -m http.server 8080
```

Tarayıcı: http://localhost:8080

Telefonda “Ana ekrana ekle” ile PWA gibi durur.

## Veri

Yeni katalog için `data.js` içine kayıt ekleyin ve kapağı `img/` altına koyun.
