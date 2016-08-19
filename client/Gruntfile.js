module.exports = function(grunt) {
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dist: {
        files: [ {src: 'index.html', dest: 'dist/index.html'} ]
      }
    },
    concat: {
            css: {
                src: [
                    'bower_components/nya-bootstrap-select/dist/css/nya-bs-select.css',  
                    'bower_components/bootstrap/dist/css/bootstrap.css',    
                    'bower_components/bootstrap/dist/css/bootstrap-theme.css',  
                    'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',  
                    'common/header/header.css',  
                    'common/login/login.css',  
                    'modules/tests/addQuestion/addQuestion.css',  
                    'app.css',  
                    'index.css',  
                    'modules/admin/assignStd/assignStd.css',  
                    'modules/admin/newUser/newUser.css',  
                    'modules/statistic/statistic.css',  
                    'modules/home/user/user-home.css',
                    'modules/admin/assignTch/assignTch.css',
                    'modules/tests/badQuestion/badQuestion.css',
                    'modules/home/home.css',
                    'infrastructure/toastr/toastr.css',
                    'modules/profile/editProfile/editProfile.css',
                    'modules/profile/editProfile/chart.css',
                    'modules/home/user/passTest/templateTests/templateQue.css',
                    'modules/home/admin/admin-home.css',
                    'modules/home/teacher/teacher-home.css',
                    "modules/profile/check microphone/checkMicrophone.css"
                ],
                dest: 'dist/site.css'
            }
        },      
    cssmin: {
            css: {
                src: 'dist/site.css',
                dest: 'dist/site.min.css'
            }
        },

    'useminPrepare': {
      options: {
        dest: 'dist'
      },
      html: 'index.html'
    },

    usemin: {
      html: ['dist/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['concat:css', 'cssmin:css','useminPrepare', 'copy', 'concat','uglify', 'usemin']);// 
};
