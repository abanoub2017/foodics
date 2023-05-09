import apiClient from "@/services/globalAxios";

class ReservationsServices {
  // List All Branchs
  static getBranchList() {
    return apiClient.get(`/branches?include[0]=sections&include[1]=sections.tables`);
  }
  // Update Branch Reservation
  static updateBranchReservation(id, payload) {
    return apiClient.put(`/branches/${id}`, payload);
  }
}
export default ReservationsServices;
