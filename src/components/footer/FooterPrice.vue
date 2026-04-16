<script setup lang="ts">
const goToPage = (url: string): void => {
  setTimeout(() => {
    location.href = url
  }, 200)
}
</script>

<template>
  <div>
    <Separator_full top="0" />
    <div class="container_footer">
      <div class="pointer_menu" @click="goToPage('/mobile_app/')" style="border-radius: 50%">
        <img
          v-wave
          src="/assets/icons/main_active.svg"
          alt="main"
        />
        <div class="footer_sub_text">Главная</div>
      </div>

      <div class="pointer_menu">
        <img
          v-wave
          src="/assets/icons/listOrder_active.svg"
          alt="listOrder"
        />
        <div class="footer_sub_text">
          <div>Список</div>
          <div>Заказов</div>
        </div>
      </div>

      <div style="border-radius: 50%" class="container_scan pointer">
        <img
          v-wave
          src="/assets/icons/scan.svg"
          alt="scan"
        />
      </div>
      <div class="pointer_menu">
        <img
          v-wave
          src="/assets/icons/call_active.svg"
          alt="call"
        />
        <div class="footer_sub_text">
          <div>Звонок</div>
          <div>покупателю</div>
        </div>
      </div>

      <div style="border-radius: 50%" class="pointer_menu">
        <img
          v-wave
          style="user-select: none"
          src="/assets/icons/finish_acvite.svg"
          alt="finish"
        />

        <div class="footer_sub_text">
          <div>Завершить</div>
          <div>Сборку</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container_footer {
  display: flex;
  justify-content: space-around;
  align-items: start;
}

.container_scan {
  position: relative;
  padding-inline: 50px;
}

.container_scan img,
.container_scan svg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -35%);
}

.footer_sub_text {
  font-size: 11px;
  color: #777776;
}

.pointer_menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 5px;
  width: 59px;
}

body .container_footer {
  white-space: nowrap;
}

@media (max-width: 360px) {
  .container_scan {
    padding-inline: 40px;
  }
}

@media (max-width: 420px) {
  .container_scan {
    padding-inline: 45px;
  }
}
</style>
