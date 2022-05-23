<template>
  <div class="custom-input-profile-image">
    <div class="custom-input-profile-image-block">
      <div class="facePhotoWrap">
        <AccountCircleSVG v-if="profileImage === ''" class="icon-account" />
        <img v-else :src="profileImage" alt="" class="body-header-facePhoto" />
      </div>
      <div class="btn-camera">
        <CameraAltSVG class="icon-camera" @click="showSetProfileImageModal()" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CustomInputProfileImage',
  components: {},
  props: {
    profileImage: { type: String, required: true, default: '' },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('common', [
      'profileImageUploadModalState',
      'profileImageStore',
    ]),
  },
  watch: {
    profileImageStore(afterVal, beforeVal) {
      if (afterVal !== beforeVal) {
        this.$emit('update', afterVal)
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('common', [
      'setProfileImage',
      'setProfileImageUploadModalState',
    ]),
    showSetProfileImageModal() {
      this.setProfileImage(this.profileImage)
      this.setProfileImageUploadModalState(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-profile-image {
  width: 100%;
  .facePhotoWrap {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: #fff 4px solid;
    overflow: hidden;
    background: #e5e5e5;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-account {
      width: 100%;
      height: 100%;
      fill: #b0b3be;
      transform: scale(1.2);
    }
  }
  .btn-camera {
    margin: 10px auto 0 auto;
    cursor: pointer;
    :hover {
      fill: #bfc2ca;
    }
  }
}
</style>
