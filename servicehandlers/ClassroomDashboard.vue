<template>
  <div>
    <div :class="$style.dashboardContainer">
      <div :class="$style.dashboardHeader">
        <div :class="$style.dashboardTitleContainer">
          <b :class="$style.dashboardTitle">Classroom Dashboard</b>
          <div :class="$style.addClassButtonContainer">
            <div
              :class="$style.addClassButton"
              @click="toggleAdminNewClassPopUp"
            >
              <div :class="$style.addClassText">Add Class</div>
              <img
                :class="$style.addClassIcon"
                alt=""
                src="/static/img/white_plus.svg"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        :class="$style.courseSectionContainer"
        v-for="program of programs"
        v-bind:key="program.id"
      >
        <div :class="$style.courseHeader">
          <b :class="$style.courseTitle">{{ program.name }} Pilot</b>
        </div>
        <div :class="$style.cardsContainer">
          <ClassCards
            v-for="classObj of classes.filter(
              (data) => data.programId === program.id,
            )"
            v-bind:key="classObj.id"
            :course="classObj"
            @goToClassGradeBook="goToClassGradeBook"
            @class="openClassView"
            @archive="archiveClass"
            @notes="toggleNotesModal"
          />
        </div>
      </div>
    </div>
    <!--    <PortalPopup-->
    <!--      v-if="isAdminNewClassPopUpOpen"-->
    <!--      overlayColor="rgba(113, 113, 113, 0.3)"-->
    <!--      placement="Centered"-->
    <!--      :onOutsideClick="closeAdminNewClassPopUp"-->
    <!--    >-->
    <!--      <AdminNewClassPopUp :onClose="closeAdminNewClassPopUp" />-->
    <!--    </PortalPopup>-->
    <admin-new-class-pop-up
      :courses="programs"
      :instructors="instructors"
      :students="students"
      :is-visible="isAdminNewClassPopUpOpen"
      @close="toggleAdminNewClassPopUp"
      @save="saveNewClass"
    ></admin-new-class-pop-up>
    <notes
      :is-visible="isNotesModalOpen"
      @close="toggleNotesModal"
      :target-name="
        selectedStudent.activeStudent?.user.firstName +
        ' ' +
        selectedStudent.activeStudent?.user.lastName
      "
      :target-user-id="selectedStudent.activeStudent?.userId"
      noteTypeName="Classroom"
    ></notes>
  </div>
</template>
<script>
// import PortalPopup from "../components/PortalPopup.vue";
import AdminNewClassPopUp from "@/pages/Dashboard/HiloPages/Classroom/AdminNewClassPopUp.vue";
import ClassCards from "@/pages/Dashboard/HiloPages/Classroom/ClassCards.vue";
import ClassesAPIService from "../../../servicehandlers/ClassesAPIService";
const classesAPIService = new ClassesAPIService();
import ProgramsAPIService from "../../../servicehandlers/ProgramsAPIService";
const programsAPIService = new ProgramsAPIService();
import ActiveInstructorsAPIService from "../../../servicehandlers/ActiveInstructorsAPIService";
const activeInstructorsAPIService = new ActiveInstructorsAPIService();
import ActiveStudentsAPIService from "../../../servicehandlers/ActiveStudentsAPIService";
import Notes from "../../../components/HiloComponents/NotesModal.vue";
const activeStudentsAPIService = new ActiveStudentsAPIService();

export default {
  name: "Frame",
  components: { Notes, ClassCards, AdminNewClassPopUp },
  data() {
    return {
      isAdminNewClassPopUpOpen: false,
      isNotesModalOpen: false,
      selectedStudent: {},
      classes: [],
      programs: [],
      instructors: [],
      students: [],
    };
  },
  mounted() {
    //console.clear();
    this.getClasses();
    this.getPrograms();
    this.getInstructors();
    this.getStudents();
  },
  methods: {
    getClasses() {
      return classesAPIService.get(this.$router).then((response) => {
        for (let classObj of response) {
          classObj.startDate = new Date(classObj.startDate);
          classObj.endDate = new Date(classObj.endDate);

          //  Loads fake grading data
          for (let student of classObj.studentToClassMaps) {
            student.grade = rand(50, 100);
            student.aheadBehind = rand(-5, 2);
          }

          function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          //  end of fake data loading
        }

        this.classes = response;
      });
    },
    getPrograms() {
      return programsAPIService.get(this.$router).then((response) => {
        this.programs = response;
      });
    },
    getInstructors() {
      return activeInstructorsAPIService.get(this.$router).then((response) => {
        for (let user of response) {
          user.name = user.user.firstName + user.user.lastName;
        }
        this.instructors = response;
      });
    },
    getStudents() {
      return activeStudentsAPIService.get(this.$router).then((response) => {
        for (let user of response) {
          user.name = user.user.firstName + user.user.lastName;
        }
        this.students = response;
      });
    },
    toggleAdminNewClassPopUp() {
      this.isAdminNewClassPopUpOpen = !this.isAdminNewClassPopUpOpen;
      this.lockScrolling();
    },
    toggleNotesModal(student = {}) {
      this.selectedStudent = student;
      this.isNotesModalOpen = !this.isNotesModalOpen;
      this.lockScrolling();
    },
    lockScrolling() {
      this.$nextTick(() => {
        const content = document.querySelector(".content");
        const viewHeight = document.body.clientHeight;

        if (content) {
          if (this.isAdminNewClassPopUpOpen || this.isNotesModalOpen) {
            content.style.height = viewHeight - 110 + "px";
            content.style.minHeight = content.style.height;
            content.style.overflow = "hidden";
          } else {
            content.style.height = "";
            content.style.overflow = "";
            content.style.minHeight = "calc(100vh - 65px)";
          }
        }
      });
    },
    saveNewClass(classObj) {
      return classesAPIService.create(classObj, this.$router).then(() => {
        this.getClasses();
        this.toggleAdminNewClassPopUp();
      });
    },
    goToClassGradeBook() {
      this.$router.push({ name: "Admin Class Grade Book" });
    },
    openClassView() {
      this.$router.push({ name: "Admin Class View" });
    },
    archiveClass(id) {
      return classesAPIService
        .update(id, { active: null }, this.$router)
        .then(() => {
          this.getClasses();
        });
    },
  },
};
</script>
<style module scoped>
.addClassText {
  position: relative;
  line-height: 25px;
}
.dashboardTitle {
  width: 300px;
  position: relative;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}
.addClassIcon {
  width: 10px;
  position: relative;
  height: 10px;
}
.addClassButton {
  position: absolute;
  top: 0;
  left: 210px;
  border-radius: 5px;
  background-color: #3c78ff;
  height: 29px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  box-sizing: border-box;
  gap: 5px;
  cursor: pointer;
}
.addClassButtonContainer {
  width: 328px;
  position: relative;
  height: 29px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.dashboardTitleContainer {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.dashboardHeader {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px;
  gap: 20px;
  z-index: 7;
  text-align: left;
  font-size: 25px;
  color: #404040;
}
.courseTitle {
  width: 300px;
  position: relative;
  font-size: 25px;
  display: inline-block;
  color: #404040;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}
.courseHeader {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  gap: 10px;
}
.cardsContainer {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
  width: 100%;
  scroll-snap-type: x mandatory;
}

.cardsContainer > * {
  flex: 0 0 calc(33.333% - 20px);
  scroll-snap-align: start;
}

.cardsContainer::-webkit-scrollbar {
  height: 8px;
}

.cardsContainer::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.cardsContainer::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 768px) {
  .cardsContainer {
    gap: 20px;
  }
}
.courseSectionContainer {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 50px;
  gap: 20px;
  z-index: 6;
}
.dashboardContainer {
  height: 100%;
  flex: 1;
  width: 100%;
  position: relative;
  background-color: #f6f6f6;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 50px;
  text-align: center;
  font-size: 18px;
  color: rgba(64, 64, 64, 0.75);
  font-family: Helvetica, Arial, sans-serif;
}
</style>
