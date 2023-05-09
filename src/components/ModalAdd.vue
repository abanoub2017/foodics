<template>
    <div>
        <b-button class="add_branch" v-b-modal.modal-1  >Add Branchs</b-button>
        <b-modal id="modal-1" hide-header hide-footer>
            <template #default="{ hide }">
                <h2 class="p-2 my-2 border-bottom">Add Branch</h2>
                <label class="typo__label mt-3">Branchs</label>
                <multiselect v-model="selectedOptions" :options="branchs_reservation" :multiple="true"
                    :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Pick some"
                    label="text" track-by="text" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                            v-if="values.length" v-show="!isOpen">{{ values.length }} options selected</span></template>
                </multiselect>
                <template v-if="selectedOptions">
                    <template v-for="select in selectedOptions">
                        <div class="select_item">
                            {{ select.text }}
                        </div>
                    </template>
                </template>

                <div class="actions">
                    <button class="close" @click="hide()">close</button>
                    <button class="save" @click="save(hide)">Save</button>
                </div>
            </template>
        </b-modal>
    </div>
</template>
  
<script>
import ReservationsServices from '@/services/foodics/reservations'
export default {
    name: "HomeView",
    data() {
        return {
            selectedOptions: [],
            accepts_reservations: true
        };
    },
    props: {
        branchs_reservation: Array,
    },
    methods: {
        async save(hide) {
            const reservations = this.branchs_reservation.map((item) => item.value);
            for (const item of reservations) {
                try {
                    const response = await ReservationsServices.updateBranchReservation(item, { accepts_reservations: this.accepts_reservations })
                    // console.log(response.data.data)
                    this.$nextTick(() => {
                        hide()
                        this.$emit('realodReservation', 'Reservation');
                        this.selectedOptions = []
                    });
                } catch (error) {
                    console.error(error)
                }
            }
        }
    },
    mounted() {
    },
    components: {  }
}
</script>
<style lang="scss" scoped>
.add_branch {
    background: transparent;
    color: #3a3a3a;
}
.actions{
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
    button{
        border: none;
        border-radius: 15px;
        padding: 10px 20px;
    }
    .save{
        background: #5f27cd;
        color: #fff;
    }
    .close{
        background: transparent;
        border: 1px solid #828282;
    }
}
</style>
  