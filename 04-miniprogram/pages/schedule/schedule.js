Page({
  data: {
    days: [
      { d: '10-03', w: '周五' }, { d: '10-04', w: '周六' }, { d: '10-05', w: '周日' },
      { d: '10-06', w: '周一' }, { d: '10-07', w: '周二' }
    ],
    active: '10-03',
    list: [
      { id: 1, time: '10:00', name: '新手入门 · 肩颈放松', teacher: '小林', level: '零基础', left: 3, note: '用墙和砖辅助，第一次来也能跟上。' },
      { id: 2, time: '19:30', name: '流瑜伽 · 强度中等', teacher: '阿May', level: '有基础', left: 1, note: '连续串联，出汗量比较大，建议带毛巾。' },
      { id: 3, time: '21:00', name: '睡前拉伸 · 舒缓', teacher: '小林', level: '零基础', left: 6, note: '灯光调暗，主要做呼吸和放松。' }
    ]
  },
  pick(e) { this.setData({ active: e.currentTarget.dataset.d }); },
  goBook(e) { wx.navigateTo({ url: '/pages/book/book?id=' + e.currentTarget.dataset.id }); }
});
