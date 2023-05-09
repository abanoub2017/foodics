<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Branch </th>
                    <th scope="col">Reference</th>
                    <th scope="col">Number of Tables</th>
                    <th scope="col">Reservation Duration</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="branch in branchesWithReservationsEnabled" :key="branch.id" @click="editPopUp(branch)"
                    class="branch_itme">
                    <template v-if="branch.accepts_reservations === true">
                        <td>{{ branch.name }}</td>
                        <td>{{ branch.reference }}</td>
                        <td>{{ branch.tablesWithReservationsEnabled.length }}</td>
                        <td>{{ branch.reservation_duration }} Minutes</td>
                    </template>
                </tr>
            </tbody>
        </table>
        <b-modal v-model="modalShow" hide-footer hide-header>
            <template #default="{ hide }">
                <h5 class="p-2 my-2 border-bottom">Edit {{ branchDetails.name }}reservations Setting</h5>
                <EditBranch :branchDetails="branchDetails"  @closeReservation="closeReservation(hide)" />
            </template>
        </b-modal>
    </div>
</template>

<script>
import ReservationsServices from '@/services/foodics/reservations'
import EditBranch from '@/components/EditBranch'
export default {
    name: 'Table',
    data() {
        return {
            accepts_reservations: false,
            modalShow: false,
            branchDetails: ''
        };
    },
    props: {
        branchs: Array,
    },
    computed: {
        branchesWithReservationsEnabled() {
            return this.branchs.map(branch => {
                const tablesWithReservationsEnabled = branch.sections
                    .flatMap(section => section.tables)
                    .filter(table => table.accepts_reservations)
                return {
                    ...branch,
                    tablesWithReservationsEnabled
                }
            }).filter(branch => branch.tablesWithReservationsEnabled.length > 0)
        }
    },
    methods: {
        async disableReservation() {
            const reservations = this.reservationsId
            for (const item of reservations) {
                try {
                    const response = await ReservationsServices.updateBranchReservation(item, { accepts_reservations: this.accepts_reservations })
                    console.log(response.data.data)
                } catch (error) {
                    console.error(error)
                }
            }
        },
        editPopUp(branch) {
            this.modalShow = !this.modalShow
            this.branchDetails = branch
        },
        closeReservation(hide){
            hide()
        }
    },
    components: {
        EditBranch
    },

}
</script>

<style lang="scss" scoped>
table {

    thead,
    tbody {

        th,
        td {
            padding: 10px 15px;
        }
    }
}

.branch_itme {
    cursor: pointer;
}
</style>