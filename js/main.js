
var dataJson = {};

$(document).ready(function () {

    // Load data from Json file
    $.getJSON("data.json", function(json) {
        dataJson = json;
        $.each(json.faculties, function (index, value) {
            $(".faculty").append('<option value="'+value.name+'">'+value.name+'</option>');
        });

        $.each(json.student, function (index, value) {
            insertStudent('#list-student', value)
        });

        $('#add-faculty').on('change', function(){
            bindingMajorValue("#add-major",json, $(this).val());

        });
        handleCheckBox();
    });


    $('.datepicker').datepicker({
        language: 'vi',
        autoclose: true
    });

    $("#add-new-student").validator().on('submit', function(e){
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            var numberStudent = dataJson.student.length;
            var form =  $(this).closest("form");
            form.validator();
            var data = form.serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            data.id = numberStudent + 1;
            insertStudent('#list-student', data);
            dataJson.student.push(data);
            form[0].reset();
            $('#addStudentModal').modal('hide');
           handleCheckBox();
            return false;
        }
    });

    $('#btn-add-student').on('click', function () {
        var numberStudent = dataJson.student.length;
        $('#id-student').val(numberStudent+1);
        $('#addStudentModal').modal('show');
    });

    $('#btn-delete-student').on('click', function () {
        var idStudent = $('#id-delete').val();

        if(parseInt(idStudent)) {
            $('#list-student tr[data-id="'+idStudent+'"] ').remove();
        } else{
            var checkbox = $('table tbody input[type="checkbox"]:checked');
            if(checkbox.length){
                $.each(checkbox, function(){
                    $(this).closest('tr').remove();
                });
            } else{
                alert('Nothing to delete');
            }

        }
        $('#deleteStudentModal').modal('hide');

    });

    $('#edit-student').on('click', function () {
        $("#form-edit-student").submit();
    });

    $("#form-edit-student").validator().on('submit',function(e){
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            var data = $("#form-edit-student").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            var id= $('#edit-student').attr('data-id');
            var studentIndex = dataJson.student.findIndex(x => x.id == id);
            $.each(data, function (index, value) {
                $('#list-student tr[data-id="'+id+'"] #'+index+'-student').text(value);
                dataJson.student[studentIndex][index] = value;
            });

            $('#editStudentModal').modal('hide');
            return false;
        }
    });


});

function insertStudent(el, data){
    $(el).append(' <tr data-id="'+data.id+'"> ' +
        '<td> ' +
        '<span class="custom-checkbox"> ' +
        '<input type="checkbox" id="checkbox1" name="options[]" value="1"> ' +
        '<label for="checkbox1"></label> ' +
        '</span> ' +
        '</td> ' +
        '<td>'+data.id+'</td> ' +
        '<td id="name-student">'+data.name+'</td> ' +
        '<td id="birthday-student">'+data.birthday+'</td> ' +
        '<td id="sex-student" >'+data.sex+'</td> ' +
        '<td id="address-student" >'+data.address+'</td> ' +
        '<td id="phone-student">'+data.phone+'</td> ' +
        '<td id="faculty-student" >'+data.faculty+'</td> ' +
        '<td id="major-student" >'+data.major+'</td> ' +
        '<td> ' +
        '<a href="#" class="edit" onclick="showInfoModal('+data.id+')" >' +
        '<i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i> ' +
        '</a> ' +
        '</td> ' +
        '<td> ' +
        '<a href="#" class="delete" data-toggle="modal"  onclick="showDeleteModal('+data.id+')"> ' +
        '<i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i> ' +
        '</a> ' +
        '</td> ' +
        '</tr>');
}

function showInfoModal(id) {
    var student = dataJson.student.find(x => x.id == id);
    bindingMajorValue("#edit-major",dataJson, student.faculty);

    $.each(student, function (index, value) {
            $('#editStudentModal input[name="'+index+'"]').val(value);
            $('#editStudentModal select[name="'+index+'"]').val(value);
            $('#editStudentModal textarea[name="'+index+'"]').val(value);
    });

    $('#edit-faculty').on('change', function(){
        bindingMajorValue("#edit-major",dataJson, $(this).val());

    });

    $('#edit-student').attr('data-id', student.id);
    $('#editStudentModal').modal('show');
}

function showDeleteModal(id) {
    $('#id-delete').val( id);
    $('#deleteStudentModal').modal('show');
}


function bindingMajorValue(el, data, value) {
    for(var i = 0; i < data.faculties.length; i++)
    {
        if(data.faculties[i].name == value)
        {
            $(el).html('<option value="000">-Chọn Chuyên Ngành-</option>');
            $.each(data.faculties[i].majors, function (index, value) {
                $(el).append('<option value="'+value.name+'">'+value.name+'</option>');
            });
        }
        if (value == '000') {
            $(el).find('option').remove()
        }
    }
}

function handleCheckBox() {
    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").on('click', function () {
        if (this.checked) {
            checkbox.each(function () {
                this.checked = true;
            });
        } else {
            checkbox.each(function () {
                this.checked = false;
            });
        }
    });
    checkbox.on('click', function () {
        if (!this.checked) {
            $("#selectAll").prop("checked", false);
        }
    });

    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
}
