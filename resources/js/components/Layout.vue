<template>
    <div class="w-full h-full">
        <nav class="h-20 w-full bg-gray-200 border-gray-300 border-b-2 fixed">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </nav>

        <router-view/>

        <footer>
            &copy; Vincent van Hoven
        </footer>
    </div>
</template>

<script>
export default {
    data () {
        return {}
    }
}
</script>