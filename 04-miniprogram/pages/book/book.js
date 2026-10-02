Page({
  data: {
    course: { time: '10:00', name: '新手入门 · 肩颈放松', teacher: '小林', level: '零基础', left: 3 },
    form: { name: '', phone: '', note: '' },
    submitted: false
  },
  onLoad(query) {
    if (query && query.id === '2') {
      this.setData({ course: { time: '19:30', name: '流瑜伽 · 强度中等', teacher: '阿May', level: '有基础', left: 1 } });
    }
  },
  onInput(e) {
    const k = e.currentTarget.dataset.k;
    this.setData({ ['form.' + k]: e.detail.value });
  },
  submit() {
    const { name, phone } = this.data.form;
    if (!name || !phone) {
      wx.showToast({ title: '姓名和手机号要填一下', icon: 'none' });
      return;
    }
    /* 正式交付时这里调后端接口或第三方表单 */
    this.setData({ submitted: true });
    wx.showToast({ title: '已提交', icon: 'success' });
  }
});
