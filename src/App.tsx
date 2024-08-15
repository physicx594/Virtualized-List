import { For, createEffect, createSignal, on, onMount } from "solid-js"
import solidLogo from "./assets/solid.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { faker } from "@faker-js/faker"
import VirtualList from "./VirtualList"

interface IPositions {
  index: number
  height: number
  top: number
  bottom: number
}

const total = 100
let screenHeight = 500
let itemSize = 50
const estimatedItemSize = 60
let listContainerRef: HTMLDivElement | undefined
function App() {
  const [list, setList] = createSignal<{ id: number; value: string }[]>([])
  const [startIndex, setStartIndex] = createSignal(0)
  const [endIndex, setEndIndex] = createSignal(0)
  const [startOffset, setStartOffset] = createSignal(0)
  const [positions, setPositions] = createSignal<IPositions[]>([])

  const visibleCount = () => Math.ceil(screenHeight / itemSize)

  const listHeight = () => positions()[positions().length - 1]?.bottom

  const handleScroll = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight, lastElementChild } =
      e.target as HTMLDivElement
    setStartIndex(Math.floor(scrollTop / itemSize))
    setEndIndex(startIndex() + visibleCount())
    setStartOffset(startIndex() * itemSize)
    // console.log(scrollTop, "e")
  }
  onMount(() => {
    // console.log(listContainerRef?.childNodes, 'listContainerRef');

    const data = []
    for (let i = 0; i < total; i++) {
      data.push({
        id: i + 1,
        value: faker.lorem.sentences(),
      })
    }
    setList(data)
    setEndIndex(startIndex() + visibleCount())
    setPositions(
      list().map((_, index) => {
        return {
          index,
          height: estimatedItemSize,
          top: estimatedItemSize * index,
          bottom: estimatedItemSize * (index + 1),
        }
      })
    )
  })

  createEffect(
    on(
      () => listContainerRef?.childNodes,
      () => {
        console.log(4444)
      }
    )
  )

  createEffect(() => {
    if (listContainerRef?.childNodes) {
      console.log(123)

      // listContainerRef!.childNodes.forEach((node, idx) => {
      //   let rect = (node as HTMLElement).getBoundingClientRect()
      //   let height = rect.height;
      //   let index = +(String(idx).slice(1))
      //   let oldHeight = positions()[index].height;
      //   let dValue = oldHeight - height;

      //   if(dValue){
      //     setPositions
      //     positions()[index].bottom = positions()[index].bottom - dValue;
      //     positions()[index].height = height;
      //     for(let k = index + 1;k<positions().length; k++){
      //       positions()[k].top = positions()[k-1].bottom;
      //       positions()[k].bottom = positions()[k].bottom - dValue;
      //     }
      //   }

      //   console.log(node, "node");

      //   // let { top, bottom, height } = (node as HTMLElement).getBoundingClientRect()
      //   // console.log(top, bottom, height, "node");

      // })
    }
    // console.log(positions(), "positions")
  })
  return (
    // <VirtualList></VirtualList>
    <div
      class="overflow-auto relative"
      onScroll={handleScroll}
      style={{ height: `${screenHeight}px` }}
    >
      <div
        class="bg-red-600 w-80"
        style={{ height: `${listHeight()}px` }}
      ></div>
      <div
        ref={listContainerRef}
        class="absolute inset-0"
        style={{ transform: `translateY(${startOffset()}px)` }}
      >
        <For each={list().slice(startIndex(), endIndex() + 1)}>
          {(item) => (
            <div
              id={`${item.id}`}
              ref={(el) => console.log(el)}
              class="flex items-center justify-center border border-blue-600"
            >
              <div>{item.id}</div>
              <div>{item.value}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export default App
