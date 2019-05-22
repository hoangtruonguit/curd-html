
var facultyData = {};

$(document).ready(function () {

    // Load data from Json file
    $.getJSON("data.json", function(json) {
        facultyData = json;
        $.each(json.faculties, function (index, value) {
            $(".faculty").append('<option value="'+value.name+'">'+value.name+'</option>');
        });

        $.each(json.student, function (index, value) {
            insertStudent('#list-student', value)
        });

        $('#add-faculty').on('change', function(){
            bindingMajorValue("#add-major",json, $(this).val());

        });


    });
    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Select/Deselect checkboxes
    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function () {
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
    checkbox.click(function () {
        if (!this.checked) {
            $("#selectAll").prop("checked", false);
        }
    });

    $('.datepicker').datepicker({
        language: 'vi',
        autoclose: true
    });

    $('#add-student').on('click', function () {
        var numberStudent = $('#list-student').find('tr').length;
        var form =  $(this).closest("form");
        var data = form.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data.id = numberStudent + 1;
         insertStudent('#list-student', data);
         form[0].reset();
        $('#addStudentModal').modal('hide');


    });

    $('#btn-add-student').on('click', function () {
        var numberStudent = $('#list-student').find('tr').length;
        $('#id-student').val(numberStudent+1);
        $('#addStudentModal').modal('show');
    });



    $('#edit-student').on('click', function () {
        var form =  $(this).closest("form");
        var data = form.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var btnEdit = '#btn-edit-student[data-id="'+id+'"]';
        var id= $(this).attr('data-id');
        $.each(data, function (index, value) {
            $('#list-student tr[data-id="'+id+'"] #'+index+'-student').text(value);
            $(btnEdit).attr("data-"+index+"",value);
        });

        $('#editStudentModal').modal('hide');
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
        '<a href="#" class="edit" onclick="showInfoModal(this)" id="btn-edit-student"  data-id="'+data.id+'" data-name="'+data.name+'" data-birthday="'+data.birthday+'"' +
        ' data-sex="'+data.sex+'" data-address="'+data.address+'" data-phone="'+data.phone+'" data-faculty="'+data.faculty+'" data-major="'+data.major+'" > ' +
        '<i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i> ' +
        '</a> ' +
        '</td> ' +
        '<td> ' +
        '<a href="#deleteEmployeeModal" class="delete" data-toggle="modal" data-id="'+data.id+'"> ' +
        '<i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i> ' +
        '</a> ' +
        '</td> ' +
        '</tr>');
}

function showInfoModal(el) {
    var data = $(el).data();
    console.log(data);
    bindingMajorValue("#edit-major",facultyData, data.faculty);


    $.each(data, function (index, value) {
            $('#editStudentModal input[name="'+index+'"]').val(value);
            $('#editStudentModal select[name="'+index+'"]').val(value);
            $('#editStudentModal textarea[name="'+index+'"]').val(value);
    });

    $('#edit-faculty').on('change', function(){
        bindingMajorValue("#edit-major",facultyData, $(this).val());

    });

    $('#edit-student').attr('data-id', data.id);
    $('#editStudentModal').modal('show');
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
