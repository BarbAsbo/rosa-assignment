import 'package:flutter_bloc/flutter_bloc.dart';

import '../models/appointment_model.dart';
import '../repository/appointment_respository.dart';
import 'appointment_event.dart';
import 'appointment_state.dart';

class AppointmentBloc extends Bloc<AppointmentEvent, AppointmentState> {
  List<DateTime> availabilities = [];
  List<AppointmentModel> appointments = [];

  String? tempAddress;
  String? tempClientStatus;
  String? tempReason;
  DateTime? tempDate;

  final AppointmentRepository appointmentRepository = AppointmentRepository();

  AppointmentBloc() : super(InitialAppointmentState()) {
    on<StartAppointmentEvent>((event, emit) async {
      emit(LoadingAppointmentState());
      try {
        availabilities = await appointmentRepository.getAllAvailabilities();
        emit(StartAppointmentState());
      } catch (e) {
        emit(FailedToStartAppointmentState(error: e));
      }
    });
    on<SaveAppointmentEvent>((event, emit) async {
      emit(SavingAppointmentState());
      try {
        appointments.add(
          AppointmentModel(
            address: tempAddress ?? '',
            clientStatus: tempClientStatus ?? '',
            reason: tempReason ?? '',
            date: tempDate!,
          ),
        );
        tempAddress = null;
        tempClientStatus = null;
        tempReason = null;
        tempDate = null;
        emit(SavedAppointmentState());
      } catch (e) {
        emit(FailedToSaveAppointmentState(error: e));
      }
    });

    on<CloseAppointmentEvent>((event, emit) async {
      tempAddress = null;
      tempClientStatus = null;
      tempReason = null;
      tempDate = null;
      emit(InitialAppointmentState());
    });
  }
}
