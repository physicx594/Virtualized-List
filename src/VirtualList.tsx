import { createSignal, onCleanup, onMount, For } from "solid-js";
import { createStore } from "solid-js/store";

// 定義每個列表項目
interface Item {
  id: number;
  height: number;
}

// 創建範例數據
const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  height: Math.floor(Math.random() * 100) + 50, // 隨機高度 50 到 150px
}));

const VirtualList = () => {
  const [viewportHeight, setViewportHeight] = createSignal(0);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [visibleItems, setVisibleItems] = createSignal<Item[]>([]);
  const [itemHeights, setItemHeights] = createStore<{ [key: number]: number }>({});

  let containerRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    const scrollTop = containerRef!.scrollTop;
    const viewportHeight = containerRef!.clientHeight;
    setScrollTop(scrollTop);
    setViewportHeight(viewportHeight);
    updateVisibleItems(scrollTop, viewportHeight);
  };

  const updateVisibleItems = (scrollTop: number, viewportHeight: number) => {
    let totalHeight = 0;
    let startIdx = 0;
    let endIdx = items.length;

    // 找出可視範圍內的第一個和最後一個項目
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights[items[i].id] || items[i].height;
      if (totalHeight + height > scrollTop && startIdx === 0) {
        startIdx = i;
      }
      if (totalHeight > scrollTop + viewportHeight) {
        endIdx = i;
        break;
      }
      totalHeight += height;
    }

    // 設置可見項目
    setVisibleItems(items.slice(startIdx, endIdx));
  };

  const measureItem = (id: number, height: number) => {
    setItemHeights(id, height);
  };

  onMount(() => {
    const height = containerRef!.clientHeight;
    setViewportHeight(height);
    updateVisibleItems(scrollTop(), height);
    containerRef!.addEventListener("scroll", handleScroll);

    onCleanup(() => {
      containerRef!.removeEventListener("scroll", handleScroll);
    });
  });

  return (
    <div ref={containerRef!} class="overflow-auto h-screen">
      <div style={{ height: `${items.reduce((sum, item) => sum + (itemHeights[item.id] || item.height), 0)}px` }}>
        <For each={visibleItems()}>
          {(item) => (
            <div
              style={{ height: `${itemHeights[item.id] || item.height}px` }}
              class="border-b p-2"
              ref={(el) => measureItem(item.id, el.clientHeight)}
            >
              Item {item.id}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default VirtualList;
