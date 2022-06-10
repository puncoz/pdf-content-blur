"use strict"
import { fabric }    from "fabric"
import * as pdfJsLib from "pdfjs-dist/build/pdf"
import pdfJsWorker   from "pdfjs-dist/build/pdf.worker.entry"

class Pdf {
    ref = null

    async loadFromUrl(url) {
        pdfJsLib.GlobalWorkerOptions.workerSrc = pdfJsWorker

        const loading = pdfJsLib.getDocument(url)

        this.ref = await new Promise((resolve, reject) => {
            loading.promise.then(pdf => {
                resolve(pdf)
            }, (error) => {
                console.error(error)
                reject(error)
            })
        })

        return this.ref.numPages
    }

    renderPage(pageNumber, canvas, canvasWidth, canvasHeight) {
        this.ref.getPage(pageNumber).then(page => {
            const viewport = page.getViewport({
                scale: canvasWidth / page.view[2],
                rotation: 0,
            })

            // Prepare canvas using PDF page dimensions
            const tempCanvas = document.createElement("canvas")
            const context = tempCanvas.getContext("2d")
            tempCanvas.height = viewport.height
            tempCanvas.width = viewport.width

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                textContext: this.ref,
            }

            page.render(renderContext).promise.then(() => {
                const bg = tempCanvas.toDataURL("image/png")

                fabric.Image.fromURL(bg, (img) => {
                    canvas.setHeight(img.height)
                    canvas.setWidth(img.width)
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
                })
            })
        })
    }
}

export default Pdf
