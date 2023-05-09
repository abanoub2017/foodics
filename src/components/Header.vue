<template>
    <b-navbar toggleable="lg" class="p-3 bg_pink shadow" type="dark">
        <b-navbar-brand href="/">Reservations</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->

            <div class="d-flex  justify-content-end w-100">
                <div class="p-2 bd-highlight">
                    <button @click="disableReservation()" class="disable_reservation">Disable Reservation</button>
                </div>
            </div>

        </b-collapse>
    </b-navbar>
</template>

<script>
import ReservationsServices from '@/services/foodics/reservations'
export default {
    name: 'Header',
    data() {
        return {
            accepts_reservations: false
        };
    },
    props: {
        reservationsId: Array,
    },
    methods: {
       async disableReservation() {
           const reservations = this.reservationsId
            for (const item of reservations) {
                try {
                    const response = await ReservationsServices.updateBranchReservation(item, { accepts_reservations: this.accepts_reservations } )
                    this.$nextTick(() => {
                        this.$emit('realodReservation', 'Reservation');
                    });
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.disable_reservation {
    padding: 15px;
    background: #5f27cd;
    border: none;
    color: white;
    border-radius: 15px;
    font-size: 14px;
}

.bg_pink {
    background: #FFF;

    .navbar-brand {
        color: #828282;

    }
}
</style>