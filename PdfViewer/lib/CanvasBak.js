"use strict"
import { fabric }      from "fabric"
import { jsPDF }       from "jspdf"
import * as pdfJsLib   from "pdfjs-dist/build/pdf"
import pdfJsWorker     from "pdfjs-dist/build/pdf.worker.entry"
import blurredImageSrc from "./blurred-image.jpeg"



class CanvasBak {
    canvas = null
    canvasProperties = {
        element: null,
        options: {},
        width: 0,
        height: 0,
        fabric: null,
    }

    blurredImage = null

    canvases = new Map()

    isDrawing = false
    blurredImgObj = null

    savedPdf = null

    mouseX = 0
    mouseY = 0

    constructor(el, options = {}) {
        fabric.Image.fromURL(blurredImageSrc, (img) => {
            this.blurredImage = img
        })

        // eslint-disable-next-line new-cap
        this.savedPdf = new jsPDF()
    }

    renderPdf(pageNumber) {
        if (this.currentPage) {
            this.savedPdf.setPage(this.currentPage)
            this.savedPdf.addImage(this.canvas.toDataURL("image/jpeg"), "JPEG", 0, 0)
            this.canvases.set(this.currentPage, JSON.stringify(this.canvas))
        }

        this.canvas.clear()
        this.currentPage = pageNumber

        console.log(this.canvases)
        if (this.canvases.has(pageNumber)) {
            console.log("restore canvas")
            this.canvas.loadFromJSON(this.canvases.get(pageNumber), () => {
                // making sure to render canvas at the end
                this.canvas.renderAll()

                // and checking if object's "name" is preserved
                console.log(this.canvas.item(0).name)
            })

            return
        }

        this.pdfRef.getPage(pageNumber).then(page => {
            //  retina scaling
            const viewport = page.getViewport({
                scale: window.devicePixelRatio || 1, rotation: 0,
            })

            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            canvas.height = viewport.height
            canvas.width = viewport.width

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context, viewport: viewport, textContext: this.pdfRef,
            }

            page.render(renderContext).promise.then(() => {
                const bg = canvas.toDataURL("image/png")

                fabric.Image.fromURL(bg, (img) => {
                    // const filter = new fabric.Image.filters.Blur({
                    //     blur: 0.5,
                    // })
                    // this.pdfImg = fabric.util.object.clone(img)
                    // this.pdfImg.filters.push(filter)
                    // this.pdfImg.applyFilters()

                    this.canvas.setHeight(img.height)
                    this.canvas.setWidth(img.width)
                    this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas))
                })
            })
        })
    }


    deleteSelected() {
        this.canvas.remove(this.canvas.getActiveObject())
    }

    exportToPdf() {
        this.savedPdf.setPage(this.currentPage)
        this.savedPdf.addImage(this.canvas.toDataURL("image/jpeg"), "JPEG", 0, 0)

        this.savedPdf.save("test.pdf")
    }
}

export default CanvasBak
