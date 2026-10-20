<template>
  <div class="hot-news">
    <pull-down-refresh
      v-model="refreshing"
      :disabled="false"
      :threshold="60"
      :max-head-height="80"
      :loading-texts="['下拉可以刷新', '松开立即刷新', '正在刷新...', '刷新完成']"
      @refresh="onRefresh"
    >
      <ul class="news-list">
        <li v-for="(item, index) in newsList" :key="item.id" class="news-card">
          <div class="news-card__body">
            <h2 class="news-card__title">
              <span class="news-card__index">{{ index + 1 }}</span>
              {{ item.title }}
            </h2>
            <p class="news-card__desc">{{ item.desc }}</p>
            <div class="news-card__meta">
              <span class="news-card__source">{{ item.source }}</span>
              <span class="news-card__time">{{ item.time }}</span>
            </div>
          </div>
          <img
            v-if="item.cover"
            class="news-card__cover"
            :src="item.cover"
            alt=""
            loading="lazy"
          />
        </li>
      </ul>

      <template #loading>
        <div class="custom-loading">
          <t-loading theme="circular" size="24px" />
          <span>正在加载最新资讯…</span>
        </div>
      </template>

      <template #success>
        <div class="custom-success">
          <span>✓ 已更新到最新</span>
        </div>
      </template>
    </pull-down-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PullDownRefresh, Toast } from 'tdesign-mobile-vue';

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  source: string;
  time: string;
  cover: string;
}

// 模拟接口返回的资讯数据
const mockData: NewsItem[] = [
  {
    id: 1,
    title: 'Vue 3.5 发布：响应式系统性能再提升',
    desc: '新版本对响应式内核进行了深度优化，渲染性能与内存占用均有改善。',
    source: '前端观察',
    time: '10 分钟前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
  },
  {
    id: 2,
    title: 'TDesign Mobile Vue 组件库持续迭代',
    desc: 'PullDownRefresh、List 等交互组件迎来体验升级，覆盖更多移动端场景。',
    source: 'TDesign 团队',
    time: '30 分钟前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
  },
  {
    id: 3,
    title: 'Vite 6 路线图公布',
    desc: '构建工具 Vite 公布下一阶段规划，聚焦环境与生态兼容性。',
    source: '技术前线',
    time: '1 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
  },
  {
    id: 4,
    title: 'TypeScript 5.6 即将发布',
    desc: '类型系统持续增强，带来更精准的类型推断与更好的开发体验。',
    source: '码农周刊',
    time: '2 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
  },
  {
    id: 5,
    title: '移动端性能优化实践指南',
    desc: '从首屏加载到交互响应，系统梳理移动端性能优化的关键手段。',
    source: '极客时间',
    time: '3 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
  },
  {
    id: 6,
    title: 'CSS 新特性 :has() 选择器全面落地',
    desc: '父级选择器终于被主流浏览器全面支持，DOM 结构判断更灵活。',
    source: 'CSS 周刊',
    time: '4 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
  },
  {
    id: 7,
    title: 'WebAssembly 在前端领域的崛起',
    desc: '越来越多高性能场景开始引入 Wasm，图像处理、加密计算率先受益。',
    source: '前沿技术',
    time: '5 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
  },
  {
    id: 8,
    title: 'Node.js 22 正式发布',
    desc: '内置测试运行器、权限模型等特性进一步成熟，稳定性显著提升。',
    source: '后端视界',
    time: '6 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
  },
  {
    id: 9,
    title: '微前端架构的得与失',
    desc: '回顾微前端这几年的实践，哪些坑值得团队在立项前认真评估。',
    source: '架构师说',
    time: '7 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
  },
  {
    id: 10,
    title: 'ESLint 9 扁平化配置详解',
    desc: '全新的 flat config 成为默认，插件生态与迁移路径一次讲清。',
    source: '代码质量',
    time: '8 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
  },
  {
    id: 11,
    title: 'React Server Components 生产实践',
    desc: '从流式渲染到按需加载，RSC 在真实项目中的落地经验分享。',
    source: '前端技术',
    time: '9 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
  },
  {
    id: 12,
    title: 'PWA 离线体验再升级',
    desc: '结合 Background Sync 与 Push，让离线应用更接近原生体验。',
    source: '移动开发',
    time: '10 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
  },
  {
    id: 13,
    title: 'AI 辅助编程工具横评',
    desc: '多款 AI 编程助手实测对比，从补全质量到上下文理解逐一分析。',
    source: '效率工具',
    time: '11 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
  },
  {
    id: 14,
    title: '设计系统从 0 到 1 搭建',
    desc: '如何沉淀一套可复用、可维护的设计系统，让团队协作更高效。',
    source: '设计前线',
    time: '12 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
  },
  {
    id: 15,
    title: '前端可观测性体系建设',
    desc: '错误监控、性能埋点、用户行为分析，构建完整的前端监控大盘。',
    source: '稳定性团队',
    time: '13 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
  },
  {
    id: 16,
    title: '边缘计算与前端结合的新可能',
    desc: 'Edge Functions 让计算更靠近用户，首屏与接口延迟大幅下降。',
    source: '云原生',
    time: '14 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
  },
  {
    id: 17,
    title: '小程序跨端框架选型指南',
    desc: 'Taro、uni-app、mpvue 横向对比，帮你找到最适合团队的方案。',
    source: '跨端开发',
    time: '15 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
  },
  {
    id: 18,
    title: 'Web 无障碍（a11y）落地清单',
    desc: '从语义化标签到键盘可达，一份可执行的前端无障碍改造清单。',
    source: '普惠技术',
    time: '16 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
  },
  {
    id: 19,
    title: 'Rust 工具链正在改写前端工程',
    desc: '从打包器到底层依赖，Rust 编写的工具正以极致性能席卷前端。',
    source: '工程化',
    time: '17 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
  },
  {
    id: 20,
    title: '2026 前端趋势展望',
    desc: 'AI、边缘渲染、类型安全……一起盘点新一年值得关注的前端方向。',
    source: '技术观察',
    time: '18 小时前',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
  },
];

const newsList = ref<NewsItem[]>([]);
const refreshing = ref(false);

const fetchNews = (): Promise<NewsItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 刷新时打乱顺序并微调时间，模拟"新数据"
      const shuffled = [...mockData].sort(() => Math.random() - 0.5);
      resolve(
        shuffled.map((item, index) => ({
          ...item,
          id: index + 1,
          time: `${index + 1} 分钟前`,
        }))
      );
    }, 1200);
  });
};

const onRefresh = async () => {
  try {
    newsList.value = await fetchNews();
    Toast({ message: '刷新成功', theme: 'success' });
  } catch {
    Toast({ message: '刷新失败，请重试', theme: 'error' });
  } finally {
    // 刷新完成必须将状态置为 false，否则会一直停留在刷新态
    refreshing.value = false;
  }
};

// 初始化加载首屏数据
fetchNews().then((data) => {
  newsList.value = data;
});
</script>

<style scoped>
.hot-news {
  min-height: 100%;
  background: #f5f5f5;
}

.hot-news__header {
  padding: 20px 16px 12px;
  background: linear-gradient(135deg, #0052d9 0%, #266fe8 100%);
  color: #fff;
}

.hot-news__title {
  font-size: 22px;
  font-weight: 600;
}

.hot-news__subtitle {
  margin-top: 4px;
  font-size: 13px;
  opacity: 0.85;
}

.news-list {
  list-style: none;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-card {
  display: flex;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.news-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #181818;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  border-radius: 50%;
  background: #0052d9;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
}

.news-card__desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #999;
  margin-top: auto;
}

.news-card__cover {
  flex-shrink: 0;
  width: 96px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  background: #f0f0f0;
}

.custom-loading,
.custom-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 13px;
  color: #666;
}

.custom-success {
  color: #00a870;
  font-weight: 500;
}
</style>
