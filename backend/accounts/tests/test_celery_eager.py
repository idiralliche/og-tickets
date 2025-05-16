"""Test module for Celery eager mode configuration and execution behavior.

This module contains tests to verify that:
- Celery is properly configured to run in eager mode during tests
- Tasks are executed immediately when using eager mode
- The task results behave as expected in synchronous execution mode
"""

from django.test import TestCase, override_settings
from celery import current_app


class CeleryEagerConfigurationTest(TestCase):
    """Test case for Celery eager mode configuration and task execution.

    This test suite validates that:
    - The Celery configuration is properly set for testing (eager mode enabled)
    - Tasks decorated with `@current_app.task` are executed synchronously
    - The task results can be retrieved immediately when using `.delay()`

    Attributes:
        None
    """

    @override_settings(
        CELERY_TASK_ALWAYS_EAGER=True,
        CELERY_TASK_EAGER_PROPAGATES=True
    )
    def test_celery_eager_mode_and_simple_task_execution(self):
        """Test Celery eager mode configuration and simple task execution.

        This test verifies that:
        1. Celery is properly configured with:
           - task_always_eager=True
           - task_eager_propagates=True
        2. A dynamically created task executes immediately
        3. The task result is immediately available and correct

        Steps:
            1. Check Celery configuration
            2. Create a simple addition task
            3. Execute the task using .delay()
            4. Verify the task executed successfully
            5. Verify the task result is correct

        Raises:
            AssertionError: If any of the test assertions fail
        """
        # 1) Check configuration is active
        self.assertTrue(
            current_app.conf.task_always_eager,
            "CELERY_TASK_ALWAYS_EAGER must be True in test mode"
        )
        self.assertTrue(
            current_app.conf.task_eager_propagates,
            "CELERY_TASK_EAGER_PROPAGATES must be True in test mode"
        )

        # 2) Create a simple addition task dynamically
        @current_app.task
        def add(x, y):
            """Simple addition task for testing purposes.
            
            Args:
                x (int): First number to add
                y (int): Second number to add
                
            Returns:
                int: The sum of x and y
            """
            return x + y

        # 3) Execute the task using .delay() (executes immediately in eager mode)
        result = add.delay(7, 8)

        # 4) Verify the task executed successfully and returned correct result
        self.assertTrue(
            result.successful(),
            "Task was not executed immediately in eager mode"
        )
        self.assertEqual(
            result.get(timeout=1), 
            15,
            "Task result is not as expected"
        )
