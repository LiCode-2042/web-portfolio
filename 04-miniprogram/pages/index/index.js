Page({
  data: {
    today: {
      date: '10-03 周五',
      list: [
        { id: 1, time: '10:00', name: '新手入门 · 肩颈放松', teacher: '小林', left: 3 },
        { id: 2, time: '19:30', name: '流瑜伽 · 强度中等', teacher: '阿May', left: 1 }
      ]
    }
  },
  goSchedule() { wx.navigateTo({ url: '/pages/schedule/schedule' }); },
  goBook(e) { wx.navigateTo({ url: '/pages/book/book?id=' + (e.currentTarget.dataset.id || '') }); },
  callStudio() { wx.makePhoneCall({ phoneNumber: '000-0000-0000' }).catch(() => {}); }
});
