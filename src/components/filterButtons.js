import React from "react";
import {ButtonGroup, Button, easing} from "@mui/material";
import {flattenFilter, laplacianFilter, edgeY, edgeX} from "./filters";

const FilterButtons = (props) => {
    const kMeans = async (k) => {
        const max_itr = 100
        const rgba = []
        const src = props.previewRef.current.getImageData()
        const dst = props.previewRef.current.createImageData()
        for (let i = 0; i < src.data.length; i += 4) {
            rgba.push(
                {
                    r: src.data[i],
                    g: src.data[i + 1],
                    b: src.data[i + 2],
                    a: src.data[i + 3],
                    i: i,
                    j: i + 1,
                    k: i + 2,
                    l: i + 3
                }
            )
        }
        const g = new Array(k) //重心たち
        for (let i = 0; i < k; i++) {
            const random = Math.floor(Math.random() * rgba.length)
            g[i] = rgba[random]  //初期の重心
        }
        let clusters = [...Array(k)].map(() => Array().fill([]))
        for (let itr = 0; itr < max_itr; itr++) {
            clusters = [...Array(k)].map(() => Array().fill([]))
            for (let i = 0; i < rgba.length; i++) {
                let r = 3 * 255 ** 2 //最大値
                let cluster_num = 0
                //重心との距離によりクラスター分け
                for (let j = 0; j < k; j++) {
                    const r1 = (rgba[i].r - g[j].r) ** 2 + (rgba[i].g - g[j].g) ** 2 + (rgba[i].b - g[j].b) ** 2 //重心との距離
                    if (r1 < r) {
                        r = r1
                        cluster_num = j
                    }
                }
                clusters[cluster_num].push(rgba[i])
            }
            // 重心再計算
            clusters.forEach((cluster, cluster_num) => {
                const g_tmp = {r: 0, g: 0, b: 0, a: 0}
                const item_num = cluster.length
                cluster.forEach(_rgba => {
                    g_tmp.r += _rgba.r / item_num
                    g_tmp.g += _rgba.g / item_num
                    g_tmp.b += _rgba.b / item_num
                })
                g[cluster_num].r = Math.round(g_tmp.r)
                g[cluster_num].g = Math.round(g_tmp.g)
                g[cluster_num].b = Math.round(g_tmp.b)
            })
        }
        clusters.map((cluster, i) => {
            cluster.map(_rgba => {
                dst.data[_rgba.i] = g[i].r
                dst.data[_rgba.j] = g[i].g
                dst.data[_rgba.k] = g[i].b
                dst.data[_rgba.l] = g[i].a
            })
        })
        props.previewRef.current.setImageData(dst)
    }

    const clickDecreaseColor = async () => {
        await kMeans(5)
    }

    const applyFilter = async (srcImage, filter) => {
        const src = srcImage
        const filterX = filter[0].length
        const filterY = filter.length
        const px = src.width
        const py = src.height
        const image = new ImageData(px, py)
        for (let x = filterX; x < px - filterX; x++) for (let y = filterY; y < py - filterY; y++) {
            const redIdx = 4 * x + px * 4 * y
            for (let fx = 0; fx < filterX; fx++) for (let fy = 0; fy < filterY; fy++) {
                const fxRefIdx = fx - (filterX - 1) / 2
                const fyRefIdx = fy - (filterY - 1) / 2
                image.data[redIdx] += src.data[4 * (x + fxRefIdx) + px * 4 * (y + fyRefIdx)] * filter[fy][fx]
                image.data[redIdx + 1] += src.data[4 * (x + fxRefIdx) + 1 + px * 4 * (y + fyRefIdx)] * filter[fy][fx]
                image.data[redIdx + 2] += src.data[4 * (x + fxRefIdx) + 2 + px * 4 * (y + fyRefIdx)] * filter[fy][fx]
            }
            image.data[redIdx] = ~~image.data[redIdx]
            image.data[redIdx + 1] = ~~image.data[redIdx + 1]
            image.data[redIdx + 2] = ~~image.data[redIdx + 2]
            image.data[redIdx + 3] = 255
        }
        return image
    }

    const kernel = async () => {
        const filtered = await applyFilter(props.previewRef.current.getImageData(), laplacianFilter)
        props.previewRef.current.setImageData(filtered)
    }

    const edge = async () => {
        const flatten = await applyFilter(props.previewRef.current.getImageData(), flattenFilter(5))
        const edgedX = await applyFilter(flatten, edgeX)
        const edgedY = await applyFilter(flatten, edgeY)
        const image = new ImageData(edgedX.width, edgedX.height)
        for (let i = 0; i < edgedX.data.length; i += 4) {
            image.data[i] = (edgedX.data[i] + edgedY.data[i]) / 2
            image.data[i + 1] = (edgedX.data[i + 1] + edgedY.data[i + 1]) / 2
            image.data[i + 2] = (edgedX.data[i + 2] + edgedY.data[i + 2]) / 2
            image.data[i + 3] = 255
        }
        props.previewRef.current.setImageData(image)
    }

    return (
        <ButtonGroup>
            <Button onClick={clickDecreaseColor} variant='contained'>減色</Button>
            <Button onClick={kernel} variant='contained'>ぼかし</Button>
            <Button onClick={edge} variant='contained'>輪郭</Button>
        </ButtonGroup>
    )
}

export default FilterButtons