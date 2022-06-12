"use strict"

import JsPdf  from "jspdf/dist/jspdf.umd.min"
import Canvas from "./Canvas"
import Pdf    from "./Pdf"

class PdfEditor {
    element = null
    canvas = null
    pdf = null

    totalPages = 1
    currentPage = 0

    canvases = new Map()

    constructor(el, pdfFileUrl, options = {}) {
        this.element = el
        this.canvas = new Canvas(this.element, options)
        this.pdf = new Pdf()

        this.pdf.loadFromUrl(pdfFileUrl).then((totalPages) => {
            this.totalPages = totalPages
            this.renderPdf(1, true).then()
        })

        this.bindEvents()
    }

    bindEvents() {
        window.addEventListener("resize", () => this.resizeEditor())
    }

    unbindEvents() {
        window.removeEventListener("resize", () => this.resizeEditor())
    }

    resizeEditor() {
        this.canvas.calculateCanvasSize()
        this.renderPdf(this.currentPage).then()
    }

    async renderAllPages() {
        for (let i = 1; i <= this.totalPages; i++) {
            await this.renderPdf(i)
        }
    }

    async renderPdf(pageNumber, forceRender = false) {
        if (!this.pdf) {
            return
        }

        this.preserveCurrentCanvas()

        this.canvas.getRef().clear()
        this.currentPage = pageNumber

        if (!forceRender && this.canvases.has(pageNumber)) {
            await this.canvas.loadFromJson(this.canvases.get(pageNumber))

            return
        }

        await this.pdf.renderPage(pageNumber, this.canvas.getRef(), this.canvas.width, this.canvas.height)

        this.preserveCurrentCanvas()
    }

    preserveCurrentCanvas() {
        if (!this.currentPage) {
            return
        }

        this.canvases.set(this.currentPage, this.canvas.toJson())
    }

    destroy() {
        this.canvas.unbindEvents()
        this.unbindEvents()
    }

    async gotoPrevPage() {
        if (this.currentPage === 1) {
            return
        }

        await this.renderPdf(this.currentPage - 1)
    }

    async gotoNextPage() {
        if (this.currentPage === this.totalPages) {
            return
        }

        await this.renderPdf(this.currentPage + 1)
    }

    deleteAll() {
        this.canvas.removeAll()
    }

    deleteSelected() {
        this.canvas.removeSelected()
    }

    async export() {
        const jsPdf = new JsPdf({
            orientation: "p",
            unit: "px",
            format: "a4",
        }).putTotalPages(this.totalPages.toString())

        this.preserveCurrentCanvas()
        const ratio = this.canvas.height / this.canvas.width

        for (let i = 1; i <= this.totalPages; i++) {
            await this.renderPdf(i)
            if (i > 1) {
                jsPdf.addPage()
            }
            jsPdf.setPage(i)

            const width = jsPdf.internal.pageSize.getWidth()
            const height = ratio * width
            jsPdf.addImage(this.canvas.getRef().toDataURL({
                format: "jpeg",
            }), "JPEG", 0, 0, width, height)
        }

        jsPdf.save("test.pdf")
    }
}

export default PdfEditor
