<template>
    <q-dialog persistent>
      <q-card>
        <q-card-section align="center">
          <q-avatar size="100px" 
           :text-color="propDialog.iconColor" 
           :icon="propDialog.icon" />
           <q-space />
           <span class="q-ml-sm" v-html="propDialog.msg"></span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="OK" 
          color="primary" v-close-popup 
          @click="closeDialog(propDialog.btnType)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
export default ({
  name: 'DialogComponent',
  props:{
    propDialog:{
        icon: {type: String},
        msg: {type: String},
        btnType :{type: String},
        iconColor :{type: String}
    }
  },
  methods:{
    closeDialog(type){
        if(type == "Signup"){
            this.$router.push("/user");
        }
    }
  }
})
</script>