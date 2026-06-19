const contentMap = {
  platform: "official-main-aiyouxi.com.cn",
  categories: [
    {
      id: "game-news",
      label: "游戏资讯",
      tags: ["爱游戏", "新游发布", "版本更新"],
      sections: [
        { title: "热门推荐", slug: "hot", items: [] },
        { title: "行业动态", slug: "industry", items: [] }
      ]
    },
    {
      id: "esports",
      label: "电竞赛事",
      tags: ["爱游戏", "赛事直播", "战队排名"],
      sections: [
        { title: "正在进行", slug: "live", items: [] },
        { title: "往期回顾", slug: "past", items: [] }
      ]
    },
    {
      id: "reviews",
      label: "游戏评测",
      tags: ["爱游戏", "评分", "深度评测"],
      sections: [
        { title: "最新评测", slug: "latest", items: [] },
        { title: "经典回顾", slug: "classic", items: [] }
      ]
    }
  ]
};

function searchByTag(tag, map) {
  const results = [];
  if (!map || !map.categories) return results;
  for (const cat of map.categories) {
    if (cat.tags && cat.tags.some(t => t.includes(tag))) {
      results.push({
        categoryId: cat.id,
        label: cat.label,
        matchedTags: cat.tags.filter(t => t.includes(tag))
      });
    }
  }
  return results;
}

function searchByKeyword(keyword, map) {
  const results = [];
  if (!map || !map.categories) return results;
  const lowerKeyword = keyword.toLowerCase();
  for (const cat of map.categories) {
    if (cat.label.toLowerCase().includes(lowerKeyword)) {
      results.push({ categoryId: cat.id, label: cat.label, type: "label" });
    }
    if (cat.tags && cat.tags.some(t => t.toLowerCase().includes(lowerKeyword))) {
      results.push({
        categoryId: cat.id,
        label: cat.label,
        type: "tag",
        matchedTags: cat.tags.filter(t => t.toLowerCase().includes(lowerKeyword))
      });
    }
    if (cat.sections) {
      for (const sec of cat.sections) {
        if (sec.title.toLowerCase().includes(lowerKeyword)) {
          results.push({ categoryId: cat.id, sectionSlug: sec.slug, title: sec.title, type: "section" });
        }
      }
    }
  }
  return results;
}

function buildContentIndex(map) {
  const index = {};
  if (!map || !map.categories) return index;
  for (const cat of map.categories) {
    if (!index[cat.id]) index[cat.id] = { tags: [], sections: [] };
    if (cat.tags) index[cat.id].tags = cat.tags.slice();
    if (cat.sections) {
      for (const sec of cat.sections) {
        index[cat.id].sections.push({ slug: sec.slug, title: sec.title });
      }
    }
  }
  return index;
}

function getTagCloud(map) {
  const freq = {};
  if (!map || !map.categories) return freq;
  for (const cat of map.categories) {
    if (cat.tags) {
      for (const tag of cat.tags) {
        const key = tag.toLowerCase();
        freq[key] = (freq[key] || 0) + 1;
      }
    }
  }
  return freq;
}

const examples = [
  { keyword: "爱游戏", expectedCount: 3 },
  { keyword: "赛事", expectedCount: 1 },
  { keyword: "评测", expectedCount: 1 }
];

(function test() {
  const index = buildContentIndex(contentMap);
  console.log("Index built:", Object.keys(index).length, "categories");
  const freq = getTagCloud(contentMap);
  console.log("Tag cloud:", JSON.stringify(freq));
  examples.forEach(ex => {
    const res = searchByKeyword(ex.keyword, contentMap);
    console.log(`Search "${ex.keyword}": ${res.length} results`);
  });
})();