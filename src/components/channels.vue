<template>
  <el-select v-model="channel_id" @change="channel_idChange">
    <el-option label="所有频道" value></el-option>
    <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelSelect',
  data () {
    return {
      channel_id: '',
      channels: []
    }
  },
  props: {
    mychannel: {
      default: ''
    }
  },
  created () {
    this.getChannels()
  },
  methods: {
    // 获取频道列表
    async getChannels () {
      let res = await this.$Http.getChannels()
      this.channels = res.channels
    },
    // value：改变后的 options 对应的 value
    channel_idChange (value) {
      // 将 value 交给父组件
      this.$emit('channel_idChange', value)
    }
  },
  watch: {
    mychannel: function () {
      this.channel_id = this.mychannel
    }
  }
}
</script>

<style scoped></style>
