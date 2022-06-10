"use strict"

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
            this.renderPdf(1)
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
        this.renderPdf(this.currentPage, true)
    }

    renderPdf(pageNumber, forceRender = false) {
        if (!this.pdf) {
            return
        }

        this.preserveCurrentCanvas()

        this.currentPage = pageNumber

        if (!forceRender && this.canvases.has(pageNumber)) {
            this.canvas.loadFromJson(this.canvases.get(pageNumber))

            return
        }

        this.pdf.renderPage(pageNumber, this.canvas.getRef(), this.canvas.width, this.canvas.height)
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

    gotoPrevPage() {
        if (this.currentPage === 1) {
            return
        }

        this.renderPdf(this.currentPage - 1)
    }

    gotoNextPage() {
        if (this.currentPage === this.totalPages) {
            return
        }

        this.renderPdf(this.currentPage + 1)
    }

    deleteAll() {
        this.canvas.removeAll()
    }

    deleteSelected() {
        this.canvas.removeSelected()
    }

    export() {
        console.log("export")
    }
}

export default PdfEditor
