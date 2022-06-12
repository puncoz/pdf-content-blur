<template>
    <div class="pdf-wrapper">
        <div class="editor">
            <pdf-editor :pdf="pdf"/>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import PdfEditor from "../../../../common/js/components/PdfViewer/PdfEditor"

    export default {
        name: "PdfEditorWrapper",

        components: { PdfEditor },

        props: {
            pdf: { type: String, required: true },
        },
    }
</script>

<style lang="scss" scoped>
    .pdf-wrapper {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #c7c7c7;
        height: 100vh;
        z-index: 99999;
        width: 100%;
        padding: 0;

        .editor {
            width: 80%;
            height: calc(100vh - 100px);
            border: 1px solid;
            overflow: auto;
        }
    }
</style>
