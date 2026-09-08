# 範例（docs/examples/quickstart.md）

```html
<script src="./dist/bazi-sdk.min.js"></script>
<script>
  const result = Bazi.calculate({
    birthDate: '1983-06-21', birthTimeMode: 'exact', birthTime: '12:30',
    gender: 'male', timezone: '+08:00',
    location: { country: 'TW', city: 'Taipei', latitude: 25.033, longitude: 121.5654 },
    trueSolarTime: false
  });
  console.log(result.pillars); // { year, month, day, hour }
  document.body.innerHTML += Bazi.Renderer.render(result, { format: 'svg', preset: 'full', theme: 'modern-oriental' });
</script>
```

只知時辰：`{ birthTimeMode: 'branch', birthHourBranch: '午' }`；
未知時間：`{ birthTimeMode: 'unknown' }`（時柱缺席、命宮身宮為 null）。
