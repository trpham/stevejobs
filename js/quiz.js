(function () {

	var app = angular.module('myQuiz', []);

	app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;
		$scope.answeredQuestions = 0;
		$scope.level = 0;

		$http.get('quiz_data.json').then(function (quizData) {
			$scope.myQuestions = quizData.data;
			$scope.totalQuestions = $scope.myQuestions.length;
		});

		$http.get('definition-data.json').then(function (dData) {
			$scope.definitions = dData.data;
		});

		$scope.selectAnswer = function (qIndex, aIndex) {
			$scope.answeredQuestions += 1;
			var questionState = $scope.myQuestions[qIndex].questionState;
			if (questionState != 'answered') {
				$scope.myQuestions[qIndex].selectedAnswer = aIndex;
				var correctAnswer = $scope.myQuestions[qIndex].correct;
				$scope.myQuestions[qIndex].correctAnswer = correctAnswer;

				if (aIndex == correctAnswer) {
					$scope.myQuestions[qIndex].correctness = 'correct';
					$scope.score += 1;
				} else {
					$scope.myQuestions[qIndex].correctness = 'incorrect';
				}
				$scope.myQuestions[qIndex].questionState = 'answered';
			}
			$scope.percentage = (($scope.score / $scope.answeredQuestions) * 100).toFixed(0);
			$scope.level = ($scope.percentage / 10).toFixed(0);
			$scope.level = ($scope.level > 1) ? $scope.level : 1;
			$scope.definition = $scope.definitions[$scope.level - 1];
		}

		$scope.selectFinish = function () {
			return $scope.activeQuestion = $scope.totalQuestions;
		}

		$scope.isSelected = function (qIndex, aIndex) {
			return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
		}

		$scope.isCorrect = function (qIndex, aIndex) {
			return $scope.myQuestions[qIndex].correctAnswer === aIndex;
		}

		$scope.selectContinue = function () {
			return $scope.activeQuestion += 1;
		}

		$scope.createShareLink = function (percentage) {
			var url = 'http://trpham.github.io/stevejobs/';
			var emailLink = '<a class="btn email" href="mailto:?subject=Steve Jobs Quiz!&amp;body=I know you love Steve Jobs as much as I do. So, try this quiz to see how much you know about him! I scored a ' + percentage + ' out of 100. Go to this link at ' + url + '">Email</a>';
			var twitterLink = '<a class="btn twitter" target="_blank" href="http://twitter.com/share?text=I know you love Steve Jobs as much as I do. So, try this quiz to see how much you know about him!&amp;hashtags=SteveJobsQuiz&amp;url=' + url + '">Tweet</a>';
			var facebook = '<a class="btn facebook" href="https://facebook.com/sharer.php?u=trpham.github.io/stevejobs/" target="_blank">Share</a>';
			var newMarkup = emailLink + twitterLink + facebook;
			return $sce.trustAsHtml(newMarkup);
		}

	}]);
})();