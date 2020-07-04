<template>
    <div class="permission">
        <iframe :src="iframeSrc" id="iframepage" frameborder="0"></iframe>
    </div>
</template>

<script>
import ENV from '../../api/env';
export default {
    name: 'permission',
    data () {
        return {
            iframeSrc: ''
        }
    },
    mounted () {
        if (ENV === 'development') {
          this.iframeSrc = 'http://kongtest.fandow.com/userMenu/admin';
        } else if (ENV === 'test') {
          this.iframeSrc = 'http://kongtest.fandow.com/userMenu/admin'
        } else {
          this.iframeSrc = 'https://api.fandow.com/userMenu/admin'
        }
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

