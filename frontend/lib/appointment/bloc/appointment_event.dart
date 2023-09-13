import 'package:equatable/equatable.dart';

abstract class AppointmentEvent extends Equatable {
  @override
  List<Object> get props => [];
}

//Initial state
class StartAppointmentEvent extends AppointmentEvent {}

class TapContinueAppointmentEvent extends AppointmentEvent {}

class TapPreviousAppointmentEvent extends AppointmentEvent {}

class CloseAppointmentEvent extends AppointmentEvent {}

class SaveAppointmentEvent extends AppointmentEvent {}
