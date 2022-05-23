export default function ({ store, redirect }) {
  if (document.querySelector('.main-container')) {
    document.querySelector('.main-container').scrollTop = 0
  }
}
