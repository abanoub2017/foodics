<template>
  <div class="home">
    <Header :reservationsId="branchs_id" @realodReservation="reloadAllBranchs()"/>
    <div class="container">
      <div class="card_reservations shadow rounded my-5">
        <div class="card_reservations_title">
          <ModalAdd :branchs_reservation="branchs_reservation" @realodReservation="reloadAllBranchs()"  />
        </div>
        <div class="card_reservations_body">
          <Table :branchs="branchs"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Table from '@/components/Table.vue'
import ModalAdd from '@/components/ModalAdd'
import ReservationsServices from '@/services/foodics/reservations'
export default {
  name: 'HomeView',
  data() {
    return {
      branchs: [],
      branchs_id: [],
      branchs_reservation: []
    };
  },
  methods: {
    async getAllBranchs() {
      await ReservationsServices.getBranchList().then((response) => {
        this.branchs = response.data.data;
        this.branchs_id = this.branchs.map((item) => item.id);
         this.branchs.map((item) => {
          if (!item.accepts_reservations) {
            // console.log(item);
            this.branchs_reservation.push( { value: item.id, text: item.name })
          } 
        });
      }).catch((error) => {
        console.error(error)
        // isLoading.value = false
      });
    },
    reloadAllBranchs(){
      console.log('test');
      this.getAllBranchs()
    }
  },
  mounted() {
    this.getAllBranchs()
  },
  components: {
    Header, Table, ModalAdd
  },
}
</script>
<style lang="scss" scoped>
.card_reservations {
  background: #fff;
  text-align: left;
  padding: 15px 0;

  .card_reservations_title {
    display: flex;
    justify-content: end;
    padding: 0 15px;

    .add_branch {
      background: transparent;
      color: #3a3a3a;
    }

  }
}
</style>
