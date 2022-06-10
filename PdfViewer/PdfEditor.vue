<template>
    <div class="pdf-editor-wrapper">
        <control :pdf-editor="pdfEditor"/>

        <div class="pdf-editor-container">
            <canvas id="pdfEditor" ref="pdfEditorCanvas"/>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Control   from "./Control"
    import PdfEditor from "./lib/PdfEditor"

    export default {
        name: "PdfEditor",

        components: { Control },

        props: {
            pdf: { type: String, required: true },
        },

        data: () => ({
            pdfEditor: null,
        }),

        async mounted() {
            await this.initPdfEditor()
        },

        destroyed() {
            if (this.pdfEditor) {
                this.pdfEditor.destroy()
            }
        },

        methods: {
            async initPdfEditor() {
                this.pdfEditor = new PdfEditor(this.$refs.pdfEditorCanvas, this.pdf)
            },
        },
    }
</script>
