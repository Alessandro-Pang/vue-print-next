<template>
  <div>
    <form>
      <div class="form-item">
        <label for="name">姓名:</label>
        <input type="text" id="name" name="user_name"/>
      </div>

      <div class="form-item">
        <label for="mail">邮箱:</label>
        <input type="email" id="mail" name="user_email"/>
      </div>

      <div class="form-item">
        <label for="sex">性别:</label>
        <div style="width: 300px; display: flex">
          <input type="radio" id="sex" name="sex"/> 男
          <input type="radio" id="sex" name="sex" checked style="margin-left: 10px"/> 女
        </div>
      </div>

      <div class="form-item">
        <label for="select">选择:</label>
        <select name="select" id="select" style="width: 300px;">
          <optgroup label="4-legged pets">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster" disabled>Hamster</option>
          </optgroup>
          <optgroup label="Flying pets">
            <option value="parrot">Parrot</option>
            <option value="macaw">Macaw</option>
            <option value="albatross">Albatross</option>
          </optgroup>
        </select>
      </div>

      <div class="form-item">
        <label for="msg">消息:</label>
        <textarea id="msg" name="user_message"></textarea>
      </div>

      <div class="button">
        <button>Send your message</button>
      </div>
    </form>

    <button v-print="{ el: 'form' }" class="mt-m">打印</button>
  </div>
</template>

<style scoped>
form {
  margin: 0 auto;
  width: 400px;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 1em;
}

.form-item {
  display: flex;
}

div + div {
  margin-top: 1em;
}

label {
  display: inline-block;
  width: 60px;
  text-align: right;
  margin-right: 0.5em;
}

input[type="text"],
input[type="email"],
textarea {
  width: 300px;
  font: 1em sans-serif;
  box-sizing: border-box;
  border: 1px solid #999;
}

input:focus,
textarea:focus {
  border-color: #000;
}

textarea {
  vertical-align: top;
  height: 5em;
  resize: vertical;
}

</style>
<script setup lang="ts">
</script>
