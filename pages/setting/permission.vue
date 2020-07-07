<template>
    <div class="permission">
        <iframe :src="iframeSrc" id="iframepage" frameborder="0"></iframe>
    </div>
</template>

<script>
import {IFRAM_SRC} from '../../api/config';
export default {
    name: 'permission',
    data () {
        return {
            iframeSrc: ''
        }
    },
    mounted () {
        this.iframeSrc = IFRAM_SRC;
        // window.location.href = window.location.href;
        window.onresize = () => {
            const ifm = document.getElementById('iframepage');
            ifm.width = document.documentElement.clientWidth - 240;
            ifm.height = document.documentElement.clientHeight;
        };
        window.onresize();
    }
};
</script>

