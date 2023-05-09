<template>
    <div class="edit_form">
        <form @submit.prevent="submitForm()">
            <!-- Reservation Duration -->
            <div class="mb-3">
                <label for="Reservation" class="form-label">Reservation Duration (minutes):</label>
                <input type="number" v-model="editBranch.reservation_duration" class="form-control" id="Reservation"
                    required>
            </div>
            <!-- Tables -->
            <label for="Tables" class="form-label">Tables:</label>
            <multiselect v-model="table_list" :options="options" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="true" placeholder="Select Tables" label="text" track-by="text"
                :preselect-first="true">
                <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                        v-if="values.length" v-show="!isOpen">{{ values.length }} options selected</span></template>
            </multiselect>
            <template v-if="table_list">
                <template v-for="select in table_list">
                    <div class="select_item">
                        {{ select.text }}
                    </div>
                </template>
            </template>


            <div>
                <button class="apply-all-btn" @click="applyAllSlots()">Apply on all days</button>
            </div>
            <div class="day-of-week" v-for="(day, index) in daysOfWeek" :key="index">
                <h3>{{ day }}</h3>
                <div class="time-slot" v-for="(slot, slotIndex) in timeSlots[index]" :key="slotIndex">
                    <div class="time-slot-info" v-if="!slot.editing">
                        {{ slot.start }} - {{ slot.end }}
                        <button class="edit-btn" @click="editSlot(index, slotIndex)">Edit</button>
                        <button class="delete-btn" @click="deleteSlot(index, slotIndex)">Delete</button>
                    </div>
                    <div class="time-slot-edit" v-else>
                        <input v-model="slot.start" type="text" placeholder="Start time (hh:mm)">
                        <input v-model="slot.end" type="text" placeholder="End time (hh:mm)">
                        <button class="save-btn" @click="saveSlot(index, slotIndex)">Save</button>
                        <button class="cancel-btn" @click="cancelEdit(index, slotIndex)">Cancel</button>
                    </div>
                </div>
                <button class="add-slot-btn" @click="addSlot(index)">Add Time Slot</button>
            </div>
            <div class="actions">
                <button type="submit" class="save">Save</button>
                <button class="close">Cancel</button>
            </div>
        </form>
        <!-- {{ branchDetails }} -->
    </div>
</template>

<script>
import ReservationsServices from '@/services/foodics/reservations'
export default {
    name: 'Table',
    data() {
        return {
            table_list: [],
            editBranch: {
                reservation_duration: '',
                reservation_times: {},
            },
            options: [],
            daysOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: [
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
                [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
            ],
        };
    },
    props: {
        branchDetails: Object,
    },
    computed: {

    },
    methods: {
        branchesWithReservationsEnabled() {
            this.branchDetails.sections.map((item) => {
                item.tables.map((table) => {
                    if (table.accepts_reservations == true) {
                        this.options.push({ value: table.id, text: `${item.name} - ${table.name}` })
                    }
                })
            })
        },

        addSlot(index) {
            if (this.timeSlots[index].length >= 3) return;
            this.timeSlots[index].push({ start: "", end: "", editing: true });
        },
        editSlot(dayIndex, slotIndex) {
            this.timeSlots[dayIndex][slotIndex].editing = true;
        },
        saveSlot(dayIndex, slotIndex) {
            const slot = this.timeSlots[dayIndex][slotIndex];
            if (slot.start === "" || slot.end === "") return;
            slot.editing = false;
        },
        cancelEdit(dayIndex, slotIndex) {
            const slot = this.timeSlots[dayIndex][slotIndex];
            if (slot.start === "" || slot.end === "") {
                this.deleteSlot(dayIndex, slotIndex);
            } else {
                slot.editing = false;
            }
        },
        deleteSlot(dayIndex, slotIndex) {
            this.timeSlots[dayIndex].splice(slotIndex, 1);
        },
        applyToAllDays(dayIndex, slotIndex) {
            const slot = this.timeSlots[dayIndex][slotIndex];
            if (slot.start === "" || slot.end === "") return;
            for (let i = 0; i < this.timeSlots[dayIndex].length; i++) {
                if (i !== slotIndex) {
                    if (this.timeSlots[i].length >= 3) {
                        this.timeSlots[i].splice(this.timeSlots[i].length - 1, 1);
                    }
                    this.timeSlots[i].push({ start: slot.start, end: slot.end, editing: false });
                }
            }
        },
        applyAllSlots() {
            const slotIndex = 0;
            this.applyToAllDays(0, slotIndex);
        },
        formatTime() {
            const formattedTimes = {};
            for (let i = 0; i < this.daysOfWeek.length; i++) {
                const day = this.daysOfWeek[i];
                const slots = this.timeSlots[i];
                formattedTimes[day] = [];
                for (let j = 0; j < slots.length; j++) {
                    const slot = slots[j];
                    if (slot.start !== "" && slot.end !== "") {
                        formattedTimes[day].push([slot.start, slot.end]);
                    }
                }
            }
            this.editBranch.reservation_times = formattedTimes;
        },

        async submitForm() {
            try {
                const response = await ReservationsServices.updateBranchReservation(this.branchDetails.id, this.editBranch)
                console.log(response.data.data)
            } catch (error) {
                console.error(error)
            }
            this.$nextTick(() => {
                this.$emit('closeReservation', 'Reservation');
            });
        }
    },
    mounted() {
        this.editBranch.reservation_duration = this.branchDetails.reservation_duration
        this.branchesWithReservationsEnabled()
    }

}
</script>

<style lang="scss" scoped>
.day-of-week {
    margin: 20px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 90%;
    max-width: 600px;
}

.time-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
}

.edit-btn,
.delete-btn,
.save-btn,
.cancel-btn,
.add-slot-btn {
    margin: 5px;
    border: none;
    border-radius: 25px;
    padding: 5px 10px;
    border-radius: 3px;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

.edit-btn,
.delete-btn {
    background-color: #f44336;
}

.save-btn,
.cancel-btn {
    background-color: #008CBA;
}


.time-slot-edit input {
    margin-right: 10px;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 70px;
}

.submit-btn,
.apply-all-btn {
    margin-top: 20px;
    border: none;
    padding: 10px;
    border-radius: 25px;
    background-color: #008CBA;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

// .apply-all-btn {
//     background-color: #555;
// }

.select_item {
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    display: inline-block;
    margin: 5px;
}

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

.actions {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;

    button {
        border: none;
        border-radius: 15px;
        padding: 10px 20px;
    }

    .save {
        background: #5f27cd;
        color: #fff;
    }

    .close {
        background: transparent;
        border: 1px solid #828282;
    }
}</style>