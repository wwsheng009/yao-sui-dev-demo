import {
  Component,
  EventData,
  EventDetail,
  $Backend,
  __sui_data
} from '@yao/sui';
const self = this as Component;

self.once = async function () {
  // 组件初始化时调用
  console.log('Survey 组件初始化');
};

// 加载调查结果
self.loadSurveyResults = async function () {
  try {
    const results = await $Backend('/survey').Call('GetSurveyResults');
    if (results) {
      self.store.SetJSON('surveyResults', results);
      await self.render('survey-results', results);
    }
  } catch (error) {
    console.error('加载调查结果失败:', error);
  }
};

self.submitSurvey = async (event: Event, data: EventData, detail: EventDetail) => {
  try {
    event.preventDefault();
    const satisfaction = self.$root.find('#satisfaction').elm() as HTMLSelectElement;
    const suggestion = self.$root.find('#suggestion').elm() as HTMLTextAreaElement;
    const result = await $Backend('/survey').Call('SubmitSurvey', {
      satisfaction: satisfaction.value,
      suggestion: suggestion.value
    });
    if (result) {
      alert('提交成功！');
      // 清空表单
      satisfaction.value = '3';
      suggestion.value = '';
      await self.loadSurveyResults();
    }
  } catch (error) {
    console.error('提交问卷失败:', error);
    alert('提交失败，请重试。');
  }
};

async function  initState() {
  // 初始化状态
  console.log('Survey 初始化状态');
}

document.addEventListener('DOMContentLoaded', initState);