import 'package:equatable/equatable.dart';

abstract class AppointmentState extends Equatable {
  @override
  List<Object> get props => [];
}

//Initial state
class InitialAppointmentState extends AppointmentState {}

class LoadingAppointmentState extends AppointmentState {}

class StartAppointmentState extends AppointmentState {}

class FailedToStartAppointmentState extends AppointmentState {
  final Object error;

  FailedToStartAppointmentState({required this.error});
}

class SavingAppointmentState extends AppointmentState {}

class SavedAppointmentState extends AppointmentState {}

class FailedToSaveAppointmentState extends AppointmentState {
  final Object error;

  FailedToSaveAppointmentState({required this.error});
}
