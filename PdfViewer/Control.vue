<template>
    <div class="control">
        <span>{{ currentPage }} / {{ totalPages }}</span>

        <button :disabled="currentPage === 1" @click.prevent="gotoPrevPage">
            Prev
        </button>

        <button :disabled="totalPages === currentPage" @click.prevent="gotoNextPage">
            Next
        </button>

        <button @click.prevent="deleteSelected">
            Delete selected
        </button>

        <button @click.prevent="deleteAll">
            Delete all
        </button>

        <button @click.prevent="save">
            Save
        </button>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "Control",

        props: {
            pdfEditor: { type: Object, required: false, default: null },
        },

        computed: {
            totalPages: function() {
                if (this.pdfEditor) {
                    return this.pdfEditor.totalPages
                }

                return 1
            },

            currentPage: function() {
                if (this.pdfEditor) {
                    return this.pdfEditor.currentPage
                }

                return 1
            },
        },

        methods: {
            gotoNextPage() {
                this.pdfEditor.gotoNextPage()
            },

            gotoPrevPage() {
                this.pdfEditor.gotoPrevPage()
            },

            deleteAll() {
                this.pdfEditor.deleteAll()
            },

            deleteSelected() {
                this.pdfEditor.deleteSelected()
            },

            save() {
                this.pdfEditor.export()
            },
        },
    }
</script>
